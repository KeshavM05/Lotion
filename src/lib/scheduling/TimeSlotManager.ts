import { db } from "@/db";
import { tasks, calendarEvents } from "@/db/schema";
import { and, eq, or, gte, lte } from "drizzle-orm";
import { SlotScorer, ScorerTask } from "./SlotScorer";
import { AutoScheduleSettings, TimeSlot, Conflict } from "./types";
import {
  addDays,
  addMinutes,
  areIntervalsOverlapping,
  getDay,
  newDate,
  roundDateUp,
  setHours,
  setMinutes,
  toZonedTime,
} from "./date-utils";

export class TimeSlotManager {
  private slotScorer: SlotScorer;
  private timeZone: string;
  private bufferMinutes: number = 15; // default

  constructor(
    private settings: AutoScheduleSettings,
    timeZone: string = "UTC"
  ) {
    this.slotScorer = new SlotScorer(settings);
    this.timeZone = timeZone;
  }

  async updateScheduledTasks(userId: string): Promise<void> {
    const scheduledTasksList = await db.query.tasks.findMany({
      where: and(
        eq(tasks.userId, userId),
        eq(tasks.isAutoScheduled, true),
      ),
    });

    const mappedTasks: ScorerTask[] = scheduledTasksList
      .filter(t => t.scheduledStart && t.scheduledEnd)
      .map(t => ({
        id: t.id,
        energyLevel: t.energyLevel,
        timePreference: t.timePreference,
        deadline: t.deadline,
        goalId: t.goalId,
        priority: t.priority,
        scheduledStart: t.scheduledStart,
        scheduledEnd: t.scheduledEnd,
      }));

    this.slotScorer.updateScheduledTasks(mappedTasks);
  }

  async findAvailableSlots(
    task: ScorerTask,
    durationMinutes: number,
    startDate: Date,
    endDate: Date,
    userId: string
  ): Promise<TimeSlot[]> {
    if (this.slotScorer.getScheduledTasks().size === 0) {
      await this.updateScheduledTasks(userId);
    }

    if (task.deadline && task.deadline > endDate) {
      // return []; // Not implemented for now to keep simplicity
    }

    const effectiveStartDate = startDate;

    const potentialSlots = this.generatePotentialSlots(
      durationMinutes,
      effectiveStartDate,
      endDate
    );

    const workHourSlots = this.filterByWorkHours(potentialSlots);
    const availableSlots = await this.removeConflicts(workHourSlots, task, userId);
    const slotsWithBuffer = this.applyBufferTimes(availableSlots);
    const scoredSlots = this.scoreSlots(slotsWithBuffer, task);
    return this.sortByScore(scoredSlots);
  }

  private generatePotentialSlots(duration: number, startDate: Date, endDate: Date): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const MINIMUM_BUFFER_MINUTES = 15;

    const localStartDate = toZonedTime(startDate, this.timeZone);
    let localEndDate = toZonedTime(endDate, this.timeZone);
    const localNow = toZonedTime(newDate(), this.timeZone);

    let localCurrentStart = localStartDate;

    if (localStartDate.toDateString() === localNow.toDateString()) {
      localCurrentStart = addMinutes(localCurrentStart, MINIMUM_BUFFER_MINUTES);
      if (localCurrentStart.getHours() >= this.settings.workHourEnd) {
        localCurrentStart = addDays(
          setMinutes(setHours(localCurrentStart, this.settings.workHourStart), 0),
          1
        );
      }
    } else {
      localCurrentStart = setMinutes(setHours(localCurrentStart, this.settings.workHourStart), 0);
    }

    localCurrentStart = roundDateUp(localCurrentStart);
    localEndDate = roundDateUp(localEndDate);

    while (localCurrentStart < localEndDate) {
      const slotEnd = addMinutes(localCurrentStart, duration);
      slots.push({
        start: newDate(localCurrentStart),
        end: newDate(slotEnd),
        score: 0,
        conflicts: [],
        energyLevel: null,
        isWithinWorkHours: false,
        hasBufferTime: false,
      });
      localCurrentStart = addMinutes(localCurrentStart, duration);
    }

    return slots;
  }

  private filterByWorkHours(slots: TimeSlot[]): TimeSlot[] {
    return slots.filter((slot) => {
      const localStart = toZonedTime(slot.start, this.timeZone);
      const localEnd = toZonedTime(slot.end, this.timeZone);
      const startHour = localStart.getHours();
      const endHour = localEnd.getHours();
      const dayOfWeek = localStart.getDay();

      const workDays = this.settings.workDays || [1, 2, 3, 4, 5];
      const isWorkDay = workDays.includes(dayOfWeek);
      const isWithinWorkHours =
        startHour >= this.settings.workHourStart &&
        endHour <= this.settings.workHourEnd &&
        startHour < this.settings.workHourEnd;

      if (isWorkDay && isWithinWorkHours) {
        slot.isWithinWorkHours = true;
        return true;
      }
      return false;
    });
  }

  private isWithinWorkHours(slot: TimeSlot): boolean {
    const localStart = toZonedTime(slot.start, this.timeZone);
    const localEnd = toZonedTime(slot.end, this.timeZone);
    const workDays = this.settings.workDays || [1, 2, 3, 4, 5];
    const slotDay = getDay(localStart);

    if (!workDays.includes(slotDay)) return false;

    const startHour = localStart.getHours();
    const endHour = localEnd.getHours();

    return (
      startHour >= this.settings.workHourStart &&
      endHour <= this.settings.workHourEnd &&
      startHour < this.settings.workHourEnd
    );
  }

  private async removeConflicts(slots: TimeSlot[], task: ScorerTask, userId: string): Promise<TimeSlot[]> {
    const availableSlots: TimeSlot[] = [];

    // Check DB for existing local calendar events within timeframe
    const earliestStart = slots[0]?.start;
    const latestEnd = slots[slots.length - 1]?.end;
    
    if (!earliestStart || !latestEnd) return [];

    const existingEvents = await db.query.calendarEvents.findMany({
      where: and(
        eq(calendarEvents.userId, userId),
        lte(calendarEvents.start, latestEnd),
        gte(calendarEvents.end, earliestStart)
      )
    });

    const existingScheduledTasks = await db.query.tasks.findMany({
       where: and(
        eq(tasks.userId, userId),
        eq(tasks.isAutoScheduled, true),
        lte(tasks.scheduledStart, latestEnd),
        gte(tasks.scheduledEnd, earliestStart)
      )
    });

    for (const slot of slots) {
      let hasConflict = false;
      const slotInterval = { start: slot.start, end: slot.end };

      // Check DB events
      for (const ev of existingEvents) {
        if (areIntervalsOverlapping(slotInterval, { start: ev.start, end: ev.end })) {
           hasConflict = true;
           slot.conflicts.push({
             type: "calendar_event",
             start: ev.start,
             end: ev.end,
             title: ev.title,
             source: { type: "calendar", id: ev.id }
           });
           break;
        }
      }

      // Check DB tasks
      if (!hasConflict) {
        for (const t of existingScheduledTasks) {
          if (t.id === task.id) continue;
          if (t.scheduledStart && t.scheduledEnd && areIntervalsOverlapping(slotInterval, { start: t.scheduledStart, end: t.scheduledEnd })) {
             hasConflict = true;
             slot.conflicts.push({
               type: "task",
               start: t.scheduledStart,
               end: t.scheduledEnd,
               title: t.title,
               source: { type: "task", id: t.id }
             });
             break;
          }
        }
      }

      if (!hasConflict) {
        availableSlots.push(slot);
      }
    }

    return availableSlots;
  }

  private calculateBufferTimes(slot: TimeSlot): { beforeBuffer: TimeSlot; afterBuffer: TimeSlot } {
    return {
      beforeBuffer: {
        start: addMinutes(slot.start, -this.bufferMinutes),
        end: slot.start,
        score: 0, conflicts: [], energyLevel: null,
        isWithinWorkHours: this.isWithinWorkHours({
          start: addMinutes(slot.start, -this.bufferMinutes),
          end: slot.start,
          score: 0, conflicts: [], energyLevel: null, isWithinWorkHours: false, hasBufferTime: false
        }),
        hasBufferTime: false,
      },
      afterBuffer: {
        start: slot.end,
        end: addMinutes(slot.end, this.bufferMinutes),
        score: 0, conflicts: [], energyLevel: null,
        isWithinWorkHours: this.isWithinWorkHours({
          start: slot.end,
          end: addMinutes(slot.end, this.bufferMinutes),
          score: 0, conflicts: [], energyLevel: null, isWithinWorkHours: false, hasBufferTime: false
        }),
        hasBufferTime: false,
      },
    };
  }

  private applyBufferTimes(slots: TimeSlot[]): TimeSlot[] {
    return slots.map((slot) => {
      const { beforeBuffer, afterBuffer } = this.calculateBufferTimes(slot);
      slot.hasBufferTime = beforeBuffer.isWithinWorkHours && afterBuffer.isWithinWorkHours;
      return slot;
    });
  }

  private scoreSlots(slots: TimeSlot[], task: ScorerTask): TimeSlot[] {
    return slots.map((slot) => {
      const score = this.slotScorer.scoreSlot(slot, task);
      return { ...slot, score: score.total };
    });
  }

  private sortByScore(slots: TimeSlot[]): TimeSlot[] {
    return [...slots].sort((a, b) => b.score - a.score);
  }
}
