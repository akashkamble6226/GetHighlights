import { create } from "zustand";

export type ThemePreference = "light" | "dark";

const themeStorageKey = "gethighlights-theme";

interface UiState {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

function readStoredTheme(): ThemePreference {
  if (typeof window === "undefined") {
    return "light";
  }

  const storedTheme = window.localStorage.getItem(themeStorageKey);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return "light";
}

export function getResolvedTheme(theme: ThemePreference) {
  return theme;
}

export function applyThemePreference(theme: ThemePreference) {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedTheme = getResolvedTheme(theme);
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.setAttribute("data-theme", resolvedTheme);
  window.localStorage.setItem(themeStorageKey, theme);
}

export const useUiStore = create<UiState>((set) => ({
  theme: readStoredTheme(),
  setTheme: (theme) => {
    applyThemePreference(theme);
    set({ theme });
  },
}));
