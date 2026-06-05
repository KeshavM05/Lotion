import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { TimeSlotManager } from "./TimeSlotManager";
import { AutoScheduleSettings, TimeSlot } from "./types";
import { addDays, newDate } from "./date-utils";
import { ScorerTask } from "./SlotScorer";

const DEFAULT_TASK_DURATION = 30; // Minutes

export class SchedulingService {
  private settings: AutoScheduleSettings;
  private timeZone: string;

  constructor(settings: AutoScheduleSettings, timeZone: string = "UTC") {
    this.settings = settings;
    this.timeZone = timeZone;
  }

  async scheduleMultipleTasks(tasksToSchedule: ScorerTask[], userId: string): Promise<ScorerTask[]> {
    const timeSlotManager = new TimeSlotManager(this.settings, this.timeZone);
    const now = newDate();

    // 1. Filter out locked tasks
    const unLockedTasks = tasksToSchedule.filter((t) => !t.scheduleLocked);

    // 2. Score tasks to determine scheduling order (higher score = schedule first)
    const initialScores = new Map<string, number>();
    const windows = [{ days: 7, label: "1 week" }];

    // Simple batched scoring
    for (const task of unLockedTasks) {
      let bestScore = 0;
      for (const window of windows) {
        const slots = await timeSlotManager.findAvailableSlots(
          task,
          task.durationMinutes || DEFAULT_TASK_DURATION,
          now,
          addDays(now, window.days),
          userId
        );
        if (slots.length > 0) {
          bestScore = Math.max(bestScore, slots[0].score);
          break;
        }
      }
      initialScores.set(task.id, bestScore);
    }

    // Sort tasks
    const sortedTasks = [...unLockedTasks].sort((a, b) => {
      const aScore = initialScores.get(a.id) || 0;
      const bScore = initialScores.get(b.id) || 0;
      return bScore - aScore;
    });

    const updatedTasks: ScorerTask[] = [];

    // 3. Schedule each task iteratively
    for (const task of sortedTasks) {
      const duration = task.durationMinutes || DEFAULT_TASK_DURATION;
      
      let scheduled = false;
      for (const window of windows) {
        const endDate = addDays(now, window.days);
        const availableSlots = await timeSlotManager.findAvailableSlots(
          task,
          duration,
          now,
          endDate,
          userId
        );

        if (availableSlots.length > 0) {
          const bestSlot = availableSlots[0];

          // Update task in DB
          await db.update(tasks).set({
            scheduledStart: bestSlot.start,
            scheduledEnd: bestSlot.end,
            isAutoScheduled: true,
            scheduleScore: Math.floor(bestSlot.score * 100), // store as integer if needed
          }).where(eq(tasks.id, task.id));

          task.scheduledStart = bestSlot.start;
          task.scheduledEnd = bestSlot.end;

          // Register conflict for subsequent iterations
          await timeSlotManager.updateScheduledTasks(userId);
          
          updatedTasks.push(task);
          scheduled = true;
          break;
        }
      }

      if (!scheduled) {
        console.warn(`Could not find an available slot for task ${task.id}`);
      }
    }

    return updatedTasks;
  }
}
