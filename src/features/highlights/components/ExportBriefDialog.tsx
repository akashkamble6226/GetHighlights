import { Check, Clipboard, Download } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { TranscriptSegment } from "@/types/api";

import { buildHighlightMoments, formatDuration, getTranscriptDuration } from "../lib/transcript";

interface ExportBriefDialogProps {
  fileName?: string;
  segments: TranscriptSegment[];
}

function slugifyFileName(value: string) {
  return value
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function ExportBriefDialog({ fileName, segments }: ExportBriefDialogProps) {
  const [copied, setCopied] = useState(false);

  const brief = useMemo(() => {
    const moments = buildHighlightMoments(segments);
    const title = fileName ?? "Uploaded video";
    const lines = [
      "GetHighlights Brief",
      `Source: ${title}`,
      `Duration: ${formatDuration(getTranscriptDuration(segments))}`,
      `Segments: ${segments.length}`,
      "",
      "Highlight moments",
      ...moments.map((moment) => `- ${moment.start} to ${moment.end}: ${moment.text}`),
      "",
      "Transcript",
      ...segments.map((segment) => `[${segment.start} - ${segment.end}] ${segment.text}`),
    ];

    return lines.join("\n");
  }, [fileName, segments]);

  const downloadBrief = () => {
    const blob = new Blob([brief], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slugifyFileName(fileName ?? "gethighlights") || "gethighlights"}-brief.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const copyBrief = () => {
    navigator.clipboard
      .writeText(brief)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      })
      .catch(() => setCopied(false));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={segments.length === 0} type="button" variant="outline">
          <Download aria-hidden="true" />
          Export brief
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export highlight brief</DialogTitle>
          <DialogDescription>
            Download or copy a timestamped brief generated from the transcript currently
            in this workspace.
          </DialogDescription>
        </DialogHeader>

        <pre className="max-h-72 overflow-auto rounded-lg border bg-muted/50 p-4 text-xs leading-5 text-muted-foreground">
          {brief}
        </pre>

        <DialogFooter>
          <Button onClick={copyBrief} type="button" variant="outline">
            {copied ? <Check aria-hidden="true" /> : <Clipboard aria-hidden="true" />}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button onClick={downloadBrief} type="button">
            <Download aria-hidden="true" />
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
