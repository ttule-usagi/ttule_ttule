import { create } from 'zustand';

interface PlanPlaceListStore {
  shouldOpenPlaceList: boolean;
  triggerOpenPlaceList: () => void;
  resetOpenPlaceList: () => void;
}

export const usePlanPlaceListStore = create<PlanPlaceListStore>((set) => ({
  shouldOpenPlaceList: false,
  triggerOpenPlaceList: () => set({ shouldOpenPlaceList: true }),
  resetOpenPlaceList: () => set({ shouldOpenPlaceList: false }),
}));
