// src/store/arrayStore.ts
import { create } from 'zustand';

interface ArrayStore<T = any> {
  data: T[];
  setData: (items: T[]) => void;
  clearData: () => void;
}

export const useVideoStore = create<ArrayStore>((set) => ({
  data: [],

  setData: (items) => set({ data: items }),

  clearData: () => set({ data: [] }),
}));
