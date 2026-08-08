import { create } from 'zustand';

interface PlanClipboardStore {
  copiedScheduleId: string | null;
  copiedDayNumber: number | null;
  setCopiedSchedule: (scheduleId: string, dayNumber: number) => void;
  clear: () => void;
}

export const usePlanClipboardStore = create<PlanClipboardStore>((set) => ({
  copiedScheduleId: null,
  copiedDayNumber: null,
  setCopiedSchedule: (scheduleId, dayNumber) => set({ copiedScheduleId: scheduleId, copiedDayNumber: dayNumber }),
  clear: () => set({ copiedScheduleId: null, copiedDayNumber: null }),
}));
