import { useMutation } from "@tanstack/react-query";

import { uploadVideo } from "@/services/api";

interface UploadVideoVariables {
  file: File;
  onProgress?: (progress: number) => void;
}

export function useVideoUpload() {
  return useMutation({
    mutationFn: ({ file, onProgress }: UploadVideoVariables) =>
      uploadVideo(file, onProgress),
  });
}
