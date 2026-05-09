import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { type ThemePreference, useUiStore } from "@/store/ui-store";

const themeOptions: {
  label: string;
  value: ThemePreference;
  icon: typeof Sun;
}[] = [
  { label: "Light", value: "light", icon: Sun },
  { label: "Dark", value: "dark", icon: Moon },
];

export function ThemeControl() {
  const theme = useUiStore((state) => state.theme);
  const setTheme = useUiStore((state) => state.setTheme);

  return (
    <div
      aria-label="Theme preference"
      className="inline-flex rounded-md border bg-background/70 p-1 shadow-sm"
      role="group"
    >
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isActive = option.value === theme;

        return (
          <button
            aria-label={option.label}
            aria-pressed={isActive}
            className={cn(
              "focus-ring inline-flex size-8 items-center justify-center rounded-sm text-muted-foreground transition",
              isActive
                ? "bg-foreground text-background shadow-sm"
                : "hover:bg-muted hover:text-foreground",
            )}
            key={option.value}
            onClick={() => setTheme(option.value)}
            type="button"
          >
            <Icon aria-hidden="true" className="size-4" />
          </button>
        );
      })}
    </div>
  );
}
