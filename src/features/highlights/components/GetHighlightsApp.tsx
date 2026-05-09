import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { useThemeSync } from "@/hooks/use-theme-sync";
import { useVideoUpload } from "@/hooks/use-video-upload";
import type { UploadResponse } from "@/types/api";

import { TopHeadingBar } from "./TopHeadingBar";
import { TranscriptTimeline } from "./TranscriptTimeline";
import { UploadHero } from "./UploadHero";

function getUploadErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "The backend is not reachable. Start the Nest server on port 3000 and try again.";
    }

    const responseData = error.response.data as { message?: string } | undefined;
    return responseData?.message ?? "The backend rejected this upload.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while processing the video.";
}

export function GetHighlightsApp() {
  useThemeSync();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const uploadMutation = useVideoUpload();

  const isUploading = uploadMutation.isPending;
  const segments = uploadResult?.transcript ?? [];
  const errorMessage = uploadMutation.isError
    ? getUploadErrorMessage(uploadMutation.error)
    : undefined;

  useEffect(() => {
    if (!isUploading) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setUploadProgress((currentProgress) => {
        if (currentProgress >= 92) {
          return currentProgress;
        }

        return Math.min(92, currentProgress + 2);
      });
    }, 1_200);

    return () => window.clearInterval(intervalId);
  }, [isUploading]);

  const handleFileSelect = useCallback(
    (file: File | null) => {
      setSelectedFile(file);
      setUploadProgress(0);
      setUploadResult(null);
      uploadMutation.reset();
    },
    [uploadMutation],
  );

  const handleUpload = useCallback(() => {
    if (!selectedFile || isUploading) {
      return;
    }

    setUploadProgress(6);
    uploadMutation.mutate(
      {
        file: selectedFile,
        onProgress: (progress) => setUploadProgress(progress),
      },
      {
        onSuccess: (data) => {
          setUploadResult(data);
          setUploadProgress(100);
        },
        onError: () => setUploadProgress(0),
      },
    );
  }, [isUploading, selectedFile, uploadMutation]);

  return (
    <div className="relative min-h-svh overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-80">
        <div className="absolute inset-0 hairline-grid" />
        <div className="absolute left-1/2 top-0 h-44 w-[44rem] -translate-x-1/2 -rotate-3 rounded-md bg-gradient-to-r from-primary/0 via-primary/[0.14] to-accent/0 blur-3xl" />
      </div>

      <TopHeadingBar />

      <main
        className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        id="workspace"
      >
        <UploadHero
          errorMessage={errorMessage}
          hasTranscript={segments.length > 0}
          isUploading={isUploading}
          onFileSelect={handleFileSelect}
          onUpload={handleUpload}
          progress={uploadProgress}
          selectedFile={selectedFile}
        />

        <TranscriptTimeline
          errorMessage={errorMessage}
          fileName={selectedFile?.name}
          isLoading={isUploading}
          segments={segments}
        />
      </main>
    </div>
  );
}
