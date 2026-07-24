"use client";

import { useEffect } from "react";
import { useUiStore } from "@/store/ui-store";

export function ThemeInit() {
  const setTheme = useUiStore((s) => s.setTheme);

  useEffect(() => {
    const stored = window.localStorage.getItem("aristo-theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
      return;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark ? "dark" : "light");
  }, [setTheme]);

  return null;
}
