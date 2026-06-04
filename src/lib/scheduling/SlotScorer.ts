import { EnergyLevel, SlotScore, TimeSlot, AutoScheduleSettings } from "./types";
import { getEnergyLevelForTime } from "./autoSchedule";
import {
  differenceInHours,
  differenceInMinutes,
  newDate,
} from "./date-utils";

// Assuming a simplified Task type for the scorer
export interface ScorerTask {
  id: string;
  energyLevel?: string | null;
  timePreference?: string | null;
  deadline?: Date | null;
  goalId?: string | null;
  priority: "low" | "medium" | "high" | "critical";
  scheduledStart?: Date | null;
  scheduledEnd?: Date | null;
  durationMinutes?: number;
  scheduleLocked?: boolean;
}

interface ProjectTask {
  start: Date;
  end: Date;
}

export class SlotScorer {
  constructor(
    private settings: AutoScheduleSettings,
    private scheduledTasks: Map<string, ProjectTask[]> = new Map()
  ) {}

  updateScheduledTasks(tasks: ScorerTask[]) {
    this.scheduledTasks.clear();
    tasks.forEach((task) => {
      if (task.goalId && task.scheduledStart && task.scheduledEnd) {
        const projectTasks = this.scheduledTasks.get(task.goalId) || [];
        projectTasks.push({
          start: task.scheduledStart,
          end: task.scheduledEnd,
        });
        this.scheduledTasks.set(task.goalId, projectTasks);
      }
    });
  }

  scoreSlot(slot: TimeSlot, task: ScorerTask): SlotScore {
    const factors = {
      workHourAlignment: this.scoreWorkHourAlignment(slot),
      energyLevelMatch: this.scoreEnergyLevelMatch(slot, task),
      projectProximity: this.scoreProjectProximity(slot, task),
      bufferAdequacy: this.scoreBufferAdequacy(slot),
      timePreference: this.scoreTimePreference(slot, task),
      deadlineProximity: this.scoreDeadlineProximity(slot, task),
      priorityScore: this.scorePriority(task),
    };

    const weights = {
      workHourAlignment: 1.0,
      energyLevelMatch: 1.5,
      projectProximity: 0.5,
      bufferAdequacy: 0.8,
      timePreference: 1.2,
      deadlineProximity: 3.0,
      priorityScore: 1.8,
    };

    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    const weightedSum = Object.entries(factors).reduce((sum, [key, value]) => {
      const weight = weights[key as keyof typeof weights];
      const contribution = value * weight;
      return sum + contribution;
    }, 0);

    const total = weightedSum / totalWeight;

    return {
      total,
      factors,
    };
  }

  private scoreWorkHourAlignment(slot: TimeSlot): number {
    return slot.isWithinWorkHours ? 1 : 0;
  }

  private scoreEnergyLevelMatch(slot: TimeSlot, task: ScorerTask): number {
    if (!task.energyLevel) return 0.5;

    const slotEnergy = getEnergyLevelForTime(
      slot.start.getHours(),
      this.settings as any
    );
    if (!slotEnergy) return 0.5;

    const energyLevels: EnergyLevel[] = ["high", "medium", "low"];
    const taskEnergyIndex = energyLevels.indexOf(task.energyLevel as EnergyLevel);
    const slotEnergyIndex = energyLevels.indexOf(slotEnergy as EnergyLevel);

    const distance = Math.abs(taskEnergyIndex - slotEnergyIndex);
    return distance === 0 ? 1 : distance === 1 ? 0.5 : 0;
  }

  private scoreBufferAdequacy(slot: TimeSlot): number {
    if (!slot.hasBufferTime) return 0;
    return 1;
  }

  private scoreTimePreference(slot: TimeSlot, task: ScorerTask): number {
    if (task.timePreference && task.timePreference !== "anytime") {
      const hour = slot.start.getHours();
      const preference = task.timePreference;
      const ranges = {
        morning: { start: 5, end: 12 },
        afternoon: { start: 12, end: 17 },
        evening: { start: 17, end: 22 },
      };
      const range = ranges[preference as keyof typeof ranges];
      if (range) {
         return hour >= range.start && hour < range.end ? 1 : 0;
      }
    }

    const minutesToSlot = differenceInMinutes(slot.start, newDate());
    const daysToSlot = minutesToSlot / (24 * 60);
    return Math.exp(-(Math.log(2) / 7) * daysToSlot);
  }

  private scoreDeadlineProximity(slot: TimeSlot, task: ScorerTask): number {
    if (!task.deadline) return 0.5;

    const now = newDate();
    const minutesOverdue = -differenceInMinutes(task.deadline, now);

    if (minutesOverdue > 0) {
      const daysOverdue = minutesOverdue / (24 * 60);
      const baseScore = Math.min(2.0, 1.0 + daysOverdue / 14);
      const daysToSlot = differenceInMinutes(slot.start, now) / (24 * 60);
      const timePenalty = Math.min(0.5, daysToSlot / 14);
      return baseScore * (1 - timePenalty);
    }

    const minutesToDeadline = differenceInMinutes(task.deadline, slot.start);
    const daysToDeadline = minutesToDeadline / (24 * 60);
    return Math.min(0.99, Math.exp(-daysToDeadline / 3));
  }

  private scoreProjectProximity(slot: TimeSlot, task: ScorerTask): number {
    if (!task.goalId) return 0.5;

    const projectTasks = this.scheduledTasks.get(task.goalId);
    if (!projectTasks || projectTasks.length === 0) return 0.5;

    const hourDistances = projectTasks.map((projectTask) => {
      const distanceToStart = Math.abs(differenceInHours(slot.start, projectTask.start));
      const distanceToEnd = Math.abs(differenceInHours(slot.end, projectTask.end));
      return Math.min(distanceToStart, distanceToEnd);
    });

    const closestDistance = Math.min(...hourDistances);
    return Math.exp(-closestDistance / 4);
  }

  private scorePriority(task: ScorerTask): number {
    switch (task.priority) {
      case "critical": return 1.0;
      case "high": return 0.8;
      case "medium": return 0.5;
      case "low": return 0.25;
      default: return 0.25;
    }
  }

  getScheduledTasks(): Map<string, ProjectTask[]> {
    return this.scheduledTasks;
  }
}
