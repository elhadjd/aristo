"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_COMPARE = 3;

interface CompareState {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
  canAdd: boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      canAdd: true,
      toggle: (id) =>
        set((state) => {
          if (state.ids.includes(id)) {
            const ids = state.ids.filter((item) => item !== id);
            return { ids, canAdd: ids.length < MAX_COMPARE };
          }
          if (state.ids.length >= MAX_COMPARE) {
            return state;
          }
          const ids = [...state.ids, id];
          return { ids, canAdd: ids.length < MAX_COMPARE };
        }),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [], canAdd: true }),
    }),
    { name: "aristo-compare" },
  ),
);
