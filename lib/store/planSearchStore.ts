import { create } from 'zustand';

interface PlanSearchStore {
  shouldFocus: boolean;
  triggerFocus: () => void;
  resetFocus: () => void;
}

export const usePlanSearchStore = create<PlanSearchStore>((set) => ({
  shouldFocus: false,
  triggerFocus: () => set({ shouldFocus: true }),
  resetFocus: () => set({ shouldFocus: false }),
}));
