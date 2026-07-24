"use client";

import { create } from "zustand";

type ThemeMode = "light" | "dark";

interface UiState {
  theme: ThemeMode;
  mobileNavOpen: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setMobileNavOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  theme: "light",
  mobileNavOpen: false,
  setTheme: (theme) => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
      window.localStorage.setItem("aristo-theme", theme);
    }
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === "light" ? "dark" : "light";
    get().setTheme(next);
  },
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
}));
