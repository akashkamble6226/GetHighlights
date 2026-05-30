import { useEffect } from "react";

import { applyThemePreference, useUiStore } from "@/store/ui-store";

export function useThemeSync() {
  const theme = useUiStore((state) => state.theme);

  useEffect(() => {
    applyThemePreference(theme);
  }, [theme]);
}
