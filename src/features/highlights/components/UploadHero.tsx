import { motion } from "framer-motion";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Circle,
  FileVideo,
  Loader2,
  Mic2,
  Scissors,
  Sparkles,
  UploadCloud,
  Wand2,
  X,
} from "lucide-react";
import { useId, useMemo, useState } from "react";

import heroLayer from "@/assets/hero.png";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import { formatFileSize } from "../lib/transcript";
import ProductStoryVisual from "./ProductStoryVisual";

interface UploadHeroProps {
  errorMessage?: string;
  hasTranscript: boolean;
  isUploading: boolean;
  onFileSelect: (file: File | null) => void;
  onUpload: () => void;
  progress: number;
  selectedFile: File | null;
}

type WorkflowStatus = "idle" | "active" | "done";

interface WorkflowStep {
  label: string;
  detail: string;
  icon: typeof UploadCloud;
  status: WorkflowStatus;
}

export function UploadHero({
  errorMessage,
  hasTranscript,
  isUploading,
  onFileSelect,
  onUpload,
  progress,
  selectedFile,
}: UploadHeroProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);

  const workflowSteps = useMemo(
    () =>
      buildWorkflowSteps({
        hasFile: Boolean(selectedFile),
        hasTranscript,
        isUploading,
        progress,
      }),
    [hasTranscript, isUploading, progress, selectedFile],
  );

  const acceptFile = (file: File | undefined) => {
    if (!file) {
      return;
    }

    if (file.type.startsWith("video/")) {
      onFileSelect(file);
    }
  };

  return (
    <section
      className="grid w-full gap-5 lg:min-h-[37rem] lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] xl:grid-cols-[minmax(0,1.12fr)_minmax(420px,0.88fr)]"
      id="workflow"
    >
      <motion.article
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel relative isolate flex min-h-[31rem] overflow-hidden rounded-lg p-6 sm:p-8 lg:p-10"
        initial={{ opacity: 0, y: 18 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      >
        <HeroBackdrop />

        <div className="relative z-10 flex w-full max-w-4xl flex-col">
          <div>
            <Badge variant="accent">
              <Sparkles aria-hidden="true" className="size-3" />
              AI video transcript platform
            </Badge>

            <h1 className="mt-6 text-4xl font-semibold leading-[1.02] text-balance text-foreground sm:text-5xl lg:text-6xl">
              Transform short videos into searchable AI transcripts.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Upload videos, extract speech instantly, review timestamped
              transcripts, and copy important moments without scrubbing through the
              whole recording.
            </p>

          </div>

          <ProductStoryVisual />
        </div>
      </motion.article>

      <motion.article
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-lg border bg-card/[0.88] p-5 shadow-2xl shadow-foreground/10 backdrop-blur sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        transition={{ delay: 0.08, duration: 0.55, ease: "easeOut" }}
      >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant={hasTranscript ? "success" : "outline"}>
              {hasTranscript ? (
                <CheckCircle2 aria-hidden="true" className="size-3" />
              ) : (
                <UploadCloud aria-hidden="true" className="size-3" />
              )}
              {hasTranscript ? "Transcript ready" : "Upload workflow"}
            </Badge>
            <h2 className="mt-4 text-2xl font-semibold leading-tight">
              Generate a reviewable transcript
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Drop a source video and track every processing step in one focused panel.
            </p>
          </div>
          <img alt="" className="hidden w-16 shrink-0 opacity-80 sm:block" src={heroLayer} />
        </div>

        <label
          className={cn(
            "group focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background mt-6 flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed bg-background/[0.62] px-5 py-8 text-center transition duration-300",
            isDragging
              ? "border-primary bg-primary/[0.08] shadow-xl shadow-primary/10"
              : "border-border hover:border-primary/60 hover:bg-background/[0.9] hover:shadow-lg hover:shadow-primary/5",
          )}
          htmlFor={inputId}
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragging(false);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            acceptFile(event.dataTransfer.files[0]);
          }}
        >
          <input
            accept="video/*"
            className="sr-only"
            id={inputId}
            onChange={(event) => acceptFile(event.target.files?.[0])}
            type="file"
          />
          <motion.span
            animate={isDragging ? { scale: 1.06 } : { scale: 1 }}
            className="flex size-14 items-center justify-center rounded-lg bg-foreground text-background shadow-xl shadow-foreground/15"
            transition={{ duration: 0.22 }}
          >
            <UploadCloud aria-hidden="true" className="size-6" />
          </motion.span>
          <p className="mt-5 text-lg font-semibold">
            {selectedFile ? "Replace source video" : "Drop video here"}
          </p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
            Browse or drag a video file to start an extraction and transcription run.
          </p>
        </label>

        <div className="mt-5 rounded-lg border bg-background/[0.58] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-md",
                  selectedFile
                    ? "bg-primary/[0.12] text-primary"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <FileVideo aria-hidden="true" className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {selectedFile ? selectedFile.name : "No video selected"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {selectedFile
                    ? `${formatFileSize(selectedFile.size)} ready for upload`
                    : "Select one source to begin"}
                </p>
              </div>
            </div>

            {selectedFile ? (
              <Button
                aria-label="Clear selected video"
                onClick={() => onFileSelect(null)}
                size="iconSm"
                type="button"
                variant="ghost"
              >
                <X aria-hidden="true" />
              </Button>
            ) : null}
          </div>

          {(isUploading || hasTranscript) && selectedFile ? (
            <div aria-live="polite" className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-medium">
                <span>{hasTranscript ? "Completed" : "Current progress"}</span>
                <span>{hasTranscript ? 100 : progress}%</span>
              </div>
              <Progress value={hasTranscript ? 100 : progress} />
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3">
          {workflowSteps.map((step, index) => (
            <WorkflowStepRow index={index} key={step.label} step={step} />
          ))}
        </div>

        {errorMessage ? (
          <div className="mt-5 flex gap-3 rounded-md border border-destructive/25 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        ) : null}

        <Separator className="my-5" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {hasTranscript
              ? "Transcript is ready for review below."
              : selectedFile
                ? "Everything is set for processing."
                : "Waiting for a source video."}
          </p>
          <Button
            className="w-full sm:w-auto"
            disabled={!selectedFile || isUploading}
            onClick={onUpload}
            size="lg"
            type="button"
          >
            {isUploading ? (
              <Loader2 aria-hidden="true" className="animate-spin" />
            ) : hasTranscript ? (
              <Check aria-hidden="true" />
            ) : (
              <Sparkles aria-hidden="true" />
            )}
            {isUploading
              ? "Processing"
              : hasTranscript
                ? "Run again"
                : "Generate transcript"}
          </Button>
        </div>
      </motion.article>
    </section>
  );
}

function buildWorkflowSteps({
  hasFile,
  hasTranscript,
  isUploading,
  progress,
}: {
  hasFile: boolean;
  hasTranscript: boolean;
  isUploading: boolean;
  progress: number;
}): WorkflowStep[] {
  const uploadDone = hasTranscript || progress >= 72;
  const processingDone = hasTranscript || progress >= 84;
  const audioDone = hasTranscript || progress >= 92;

  return [
    {
      label: "Uploading",
      detail: hasFile ? "Source video staged" : "Waiting for source",
      icon: UploadCloud,
      status: uploadDone ? "done" : isUploading ? "active" : "idle",
    },
    {
      label: "Processing",
      detail: "Preparing media for extraction",
      icon: Wand2,
      status: processingDone ? "done" : uploadDone ? "active" : "idle",
    },
    {
      label: "Audio Extracted",
      detail: "Audio stream prepared",
      icon: Scissors,
      status: audioDone ? "done" : processingDone ? "active" : "idle",
    },
    {
      label: "Transcription Completed",
      detail: "Timeline ready for review",
      icon: Mic2,
      status: hasTranscript ? "done" : audioDone ? "active" : "idle",
    },
  ];
}

function WorkflowStepRow({ index, step }: { index: number; step: WorkflowStep }) {
  const Icon = step.icon;
  const isActive = step.status === "active";
  const isDone = step.status === "done";

  return (
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "flex items-center gap-3 rounded-lg border p-3 transition",
        isDone
          ? "border-emerald-500/25 bg-emerald-500/[0.08]"
          : isActive
            ? "border-primary/35 bg-primary/[0.07] shadow-lg shadow-primary/5"
            : "bg-background/[0.45]",
      )}
      initial={{ opacity: 0, x: 12 }}
      transition={{ delay: 0.18 + index * 0.05, duration: 0.36 }}
    >
      <motion.span
        animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-md border",
          isDone
            ? "border-emerald-500/25 bg-emerald-500/[0.14] text-emerald-600 dark:text-emerald-300"
            : isActive
              ? "border-primary/25 bg-primary/[0.14] text-primary"
              : "border-border bg-muted text-muted-foreground",
        )}
        transition={isActive ? { duration: 1.2, repeat: Infinity } : { duration: 0.2 }}
      >
        {isDone ? (
          <CheckCircle2 aria-hidden="true" className="size-4" />
        ) : isActive ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <Circle aria-hidden="true" className="size-4" />
        )}
      </motion.span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{step.label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{step.detail}</p>
      </div>

      <Icon
        aria-hidden="true"
        className={cn("size-4", isActive || isDone ? "text-primary" : "text-muted-foreground")}
      />
    </motion.div>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 hairline-grid opacity-60" />
      <motion.div
        animate={{ x: [0, 28, -16, 0], opacity: [0.62, 0.9, 0.72, 0.62] }}
        className="absolute -left-24 top-16 h-24 w-[42rem] -rotate-6 rounded-md bg-gradient-to-r from-primary/0 via-primary/[0.18] to-accent/0 blur-2xl"
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        animate={{ x: [0, -22, 18, 0], opacity: [0.48, 0.78, 0.58, 0.48] }}
        className="absolute -right-24 bottom-20 h-24 w-[40rem] rotate-6 rounded-md bg-gradient-to-r from-secondary/0 via-accent/[0.18] to-primary/0 blur-2xl"
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

