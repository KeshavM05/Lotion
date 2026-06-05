import { Task, CalendarEvent } from "@/lib/store";

export type EnergyLevel = "high" | "medium" | "low";

export interface TimeSlot {
  start: Date;
  end: Date;
  score: number;
  conflicts: Conflict[];
  energyLevel: EnergyLevel | null;
  isWithinWorkHours: boolean;
  hasBufferTime: boolean;
}

export interface Conflict {
  type: "calendar_event" | "task" | "buffer" | "outside_work_hours";
  start: Date;
  end: Date;
  title: string;
  source: {
    type: "calendar" | "task";
    id: string;
  };
}

export interface SlotScore {
  total: number;
  factors: {
    workHourAlignment: number;
    energyLevelMatch: number;
    projectProximity: number;
    bufferAdequacy: number;
    timePreference: number;
    deadlineProximity: number;
    priorityScore: number;
  };
}

export interface AutoScheduleSettings {
  workDays: number[];
  workHourStart: number;
  workHourEnd: number;
  highEnergyStart: number | null;
  highEnergyEnd: number | null;
  mediumEnergyStart: number | null;
  mediumEnergyEnd: number | null;
  lowEnergyStart: number | null;
  lowEnergyEnd: number | null;
}
