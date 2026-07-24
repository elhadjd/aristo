"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT = 8;

interface RecentlyViewedState {
  ids: string[];
  add: (id: string) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      ids: [],
      add: (id) =>
        set((state) => ({
          ids: [id, ...state.ids.filter((item) => item !== id)].slice(0, MAX_RECENT),
        })),
      clear: () => set({ ids: [] }),
    }),
    { name: "aristo-recently-viewed" },
  ),
);
