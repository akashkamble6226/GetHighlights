import type { TranscriptSegment } from "@/types/api";

const signalWords = [
  "action",
  "customer",
  "decision",
  "growth",
  "launch",
  "metric",
  "priority",
  "problem",
  "revenue",
  "risk",
  "strategy",
  "timeline",
];

export interface HighlightMoment extends TranscriptSegment {
  index: number;
  score: number;
}

export function timestampToSeconds(timestamp: string) {
  const parts = timestamp
    .split(":")
    .map((part) => Number.parseFloat(part));

  if (parts.length === 3) {
    return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60 + (parts[2] ?? 0);
  }

  if (parts.length === 2) {
    return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
  }

  return parts[0] ?? 0;
}

export function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const roundedSeconds = Math.round(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export function getTranscriptDuration(segments: TranscriptSegment[]) {
  const lastSegment = segments.at(-1);

  if (!lastSegment) {
    return 0;
  }

  return timestampToSeconds(lastSegment.end);
}

export function getWordCount(segments: TranscriptSegment[]) {
  return segments.reduce((total, segment) => {
    const words = segment.text.trim().split(/\s+/).filter(Boolean);
    return total + words.length;
  }, 0);
}

export function buildHighlightMoments(segments: TranscriptSegment[]) {
  return segments
    .map<HighlightMoment>((segment, index) => {
      const text = segment.text.toLowerCase();
      const keywordScore = signalWords.reduce(
        (score, word) => score + (text.includes(word) ? 3 : 0),
        0,
      );
      const densityScore = Math.min(segment.text.length / 42, 5);

      return {
        ...segment,
        index,
        score: keywordScore + densityScore,
      };
    })
    .sort((first, second) => second.score - first.score)
    .slice(0, 5)
    .sort((first, second) => first.index - second.index);
}

export function formatFileSize(size: number) {
  if (size < 1024) {
    return `${size} B`;
  }

  const units = ["KB", "MB", "GB"];
  let value = size / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}
