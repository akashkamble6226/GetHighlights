import { AudioLines } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ThemeControl } from "./ThemeControl";

export function TopHeadingBar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/[0.72] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          className="focus-ring inline-flex items-center gap-3 rounded-md"
          href="#workspace"
        >
          <span className="flex size-9 items-center justify-center rounded-lg bg-foreground text-background shadow-lg shadow-foreground/10">
            <AudioLines aria-hidden="true" className="size-4" />
          </span>
          <span>
            <span className="block text-sm font-semibold leading-none">
              GetHighlights
            </span>
            <span className="mt-1 hidden text-xs text-muted-foreground sm:block">
              AI video transcript studio
            </span>
          </span>
        </a>

        <nav aria-label="Workspace navigation" className="flex items-center gap-2">
          <div className="hidden items-center gap-1 md:flex">
            <Button asChild size="sm" variant="ghost">
              <a href="#workflow">Workflow</a>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <a href="#transcript-review">Transcript</a>
            </Button>
          </div>
          <ThemeControl />
        </nav>
      </div>
    </header>
  );
}
