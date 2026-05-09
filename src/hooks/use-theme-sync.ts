import { useEffect } from "react";

import { applyThemePreference, useUiStore } from "@/store/ui-store";

export function useThemeSync() {
  const theme = useUiStore((state) => state.theme);

  useEffect(() => {
    applyThemePreference(theme);

    if (theme !== "system") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const syncSystemTheme = () => applyThemePreference("system");

    mediaQuery.addEventListener("change", syncSystemTheme);

    return () => {
      mediaQuery.removeEventListener("change", syncSystemTheme);
    };
  }, [theme]);
}
