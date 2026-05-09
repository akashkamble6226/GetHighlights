import { motion } from "framer-motion";
import {
  AlertTriangle,
  Captions,
  Check,
  Clock3,
  Copy,
  Search,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { TranscriptSegment } from "@/types/api";

import {
  buildHighlightMoments,
  formatDuration,
  getTranscriptDuration,
  getWordCount,
} from "../lib/transcript";
import { ExportBriefDialog } from "./ExportBriefDialog";

interface TranscriptTimelineProps {
  errorMessage?: string;
  fileName?: string;
  isLoading: boolean;
  segments: TranscriptSegment[];
}

interface VisibleSegment {
  key: string;
  originalIndex: number;
  segment: TranscriptSegment;
}

export function TranscriptTimeline({
  errorMessage,
  fileName,
  isLoading,
  segments,
}: TranscriptTimelineProps) {
  const [query, setQuery] = useState("");
  const [activeSegmentKey, setActiveSegmentKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const highlights = useMemo(() => buildHighlightMoments(segments), [segments]);
  const metrics = useMemo(
    () => [
      { label: "Segments", value: segments.length.toLocaleString() },
      { label: "Words", value: getWordCount(segments).toLocaleString() },
      { label: "Duration", value: formatDuration(getTranscriptDuration(segments)) },
    ],
    [segments],
  );
  const visibleSegments = useMemo<VisibleSegment[]>(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return segments
      .map((segment, originalIndex) => ({
        key: `${segment.start}-${segment.end}-${originalIndex}`,
        originalIndex,
        segment,
      }))
      .filter(({ segment }) => {
        if (!normalizedQuery) {
          return true;
        }

        return segment.text.toLowerCase().includes(normalizedQuery);
      });
  }, [query, segments]);

  const activeKeyStillVisible = visibleSegments.some(
    ({ key }) => key === activeSegmentKey,
  );
  const resolvedActiveKey =
    activeSegmentKey && activeKeyStillVisible
      ? activeSegmentKey
      : visibleSegments[0]?.key ?? null;

  const copySegment = (key: string, text: string) => {
    if (!navigator.clipboard) {
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedKey(key);
        window.setTimeout(() => setCopiedKey(null), 1500);
      })
      .catch(() => setCopiedKey(null));
  };

  return (
    <section
      className="rounded-lg border bg-card/[0.84] shadow-2xl shadow-foreground/5 backdrop-blur"
      id="transcript-review"
    >
      <div className="flex flex-col gap-5 border-b p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              <Captions aria-hidden="true" className="size-3" />
              Review timeline
            </Badge>
            {segments.length > 0 ? <Badge variant="success">Ready</Badge> : null}
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
            Transcript review
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Scan timestamped transcript cards, filter for exact phrases, and copy the
            individual moments you want to reuse.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="grid grid-cols-3 gap-2 rounded-lg border bg-background/[0.56] p-2">
            {metrics.map((metric) => (
              <div className="min-w-20 px-2 py-1.5 text-center" key={metric.label}>
                <p className="text-sm font-semibold">{metric.value}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
          <ExportBriefDialog fileName={fileName} segments={segments} />
        </div>
      </div>

      <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.36fr)]">
        <div className="min-w-0">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold">Timeline moments</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {segments.length > 0
                  ? `${visibleSegments.length} visible of ${segments.length} transcript blocks`
                  : "Upload a video to populate this review area"}
              </p>
            </div>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                aria-label="Search transcript"
                className="w-full bg-background/[0.68] pl-9 sm:w-72"
                disabled={segments.length === 0}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search transcript"
                value={query}
              />
            </div>
          </div>

          <div className="transcript-scroll max-h-[38rem] overflow-y-auto pr-1">
            {isLoading ? <TranscriptSkeleton /> : null}

            {!isLoading && errorMessage ? (
              <div className="flex gap-3 rounded-lg border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive">
                <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <div>
                  <p className="font-semibold">Upload failed</p>
                  <p className="mt-1">{errorMessage}</p>
                </div>
              </div>
            ) : null}

            {!isLoading && !errorMessage && segments.length === 0 ? <EmptyTranscript /> : null}

            {!isLoading && !errorMessage && segments.length > 0 ? (
              visibleSegments.length > 0 ? (
                <motion.ol
                  animate="show"
                  className="relative grid gap-3"
                  initial="hidden"
                  variants={{
                    hidden: {},
                    show: { transition: { staggerChildren: 0.045 } },
                  }}
                >
                  {visibleSegments.map(({ key, originalIndex, segment }) => {
                    const isActive = resolvedActiveKey === key;
                    const isCopied = copiedKey === key;

                    return (
                      <motion.li
                        className="relative pl-6"
                        key={key}
                        variants={{
                          hidden: { opacity: 0, y: 12 },
                          show: { opacity: 1, y: 0 },
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute left-0 top-5 size-2 rounded-sm border",
                            isActive
                              ? "border-primary bg-primary shadow-lg shadow-primary/30"
                              : "border-border bg-muted",
                          )}
                        />
                        <span
                          aria-hidden="true"
                          className="absolute bottom-[-0.75rem] left-[0.1875rem] top-8 w-px bg-border"
                        />

                        <article
                          aria-current={isActive ? "step" : undefined}
                          className={cn(
                            "group rounded-lg border bg-background/[0.66] p-4 shadow-sm outline-none transition duration-300 hover:border-primary/45 hover:bg-background/[0.92] hover:shadow-xl hover:shadow-primary/5 focus-visible:border-primary/60 focus-visible:shadow-xl focus-visible:shadow-primary/10",
                            isActive &&
                              "border-primary/55 bg-primary/[0.06] shadow-xl shadow-primary/10",
                          )}
                          onClick={() => setActiveSegmentKey(key)}
                          onFocus={() => setActiveSegmentKey(key)}
                          onMouseEnter={() => setActiveSegmentKey(key)}
                          tabIndex={0}
                        >
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                  className={cn(
                                    "font-mono",
                                    isActive && "border-primary/30 text-primary",
                                  )}
                                  variant="outline"
                                >
                                  <Clock3 aria-hidden="true" className="size-3" />
                                  {segment.start} - {segment.end}
                                </Badge>
                                <span className="text-xs font-medium text-muted-foreground">
                                  Block {originalIndex + 1}
                                </span>
                              </div>
                              <p className="mt-3 text-sm leading-7 text-foreground sm:text-[15px]">
                                {segment.text}
                              </p>
                            </div>

                            <Button
                              aria-label={`Copy transcript block ${originalIndex + 1}`}
                              className="shrink-0"
                              onClick={(event) => {
                                event.stopPropagation();
                                copySegment(key, segment.text);
                              }}
                              size="sm"
                              type="button"
                              variant={isCopied ? "subtle" : "outline"}
                            >
                              {isCopied ? (
                                <Check aria-hidden="true" />
                              ) : (
                                <Copy aria-hidden="true" />
                              )}
                              {isCopied ? "Copied" : "Copy"}
                            </Button>
                          </div>
                        </article>
                      </motion.li>
                    );
                  })}
                </motion.ol>
              ) : (
                <div className="rounded-lg border bg-muted/[0.35] p-8 text-center">
                  <Search
                    aria-hidden="true"
                    className="mx-auto size-8 text-muted-foreground"
                  />
                  <p className="mt-4 font-semibold">No matching transcript moments</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try another term or clear the search field.
                  </p>
                </div>
              )
            ) : null}
          </div>
        </div>

        <aside className="rounded-lg border bg-background/[0.58] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Highlight moments</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Ranked from transcript density and signal words.
              </p>
            </div>
            <Wand2 aria-hidden="true" className="size-5 text-primary" />
          </div>

          {isLoading ? (
            <div className="mt-5 grid gap-3">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          ) : highlights.length > 0 ? (
            <ol className="mt-5 grid gap-3">
              {highlights.map((moment, index) => (
                <li
                  className="rounded-md border bg-card/[0.72] p-3 text-sm shadow-sm transition hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5"
                  key={`${moment.start}-${moment.end}-${index}`}
                >
                  <p className="font-mono text-xs text-primary">
                    {moment.start} to {moment.end}
                  </p>
                  <p className="mt-2 leading-6 text-muted-foreground">{moment.text}</p>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-5 rounded-md border border-dashed p-5 text-sm leading-6 text-muted-foreground">
              Highlight moments appear after a transcript is processed.
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function TranscriptSkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div className="rounded-lg border bg-background/[0.6] p-4" key={index}>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
}

function EmptyTranscript() {
  return (
    <div className="flex min-h-[28rem] items-center justify-center rounded-lg border border-dashed bg-muted/[0.26] p-8 text-center">
      <div className="max-w-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-background text-primary shadow-sm">
          <Sparkles aria-hidden="true" className="size-6" />
        </div>
        <p className="mt-5 text-lg font-semibold">No transcript yet</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Upload a video to populate timestamped transcript blocks and highlight
          moments.
        </p>
      </div>
    </div>
  );
}
