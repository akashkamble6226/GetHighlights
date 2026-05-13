import axios, { type AxiosProgressEvent } from "axios";

import type { UploadResponse } from "@/types/api";

const baseURL = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.origin !== 'http://localhost:5173' 
    ? window.location.origin 
    : 'http://localhost:3000');

export const api = axios.create({
  baseURL,
});

export async function uploadVideo(
  file: File,
  onProgress?: (progress: number) => void,
) {
  const formData = new FormData();
  formData.append("video", file);

  const response = await api.post<UploadResponse>("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
      if (!progressEvent.total) {
        onProgress?.(18);
        return;
      }

      const progress = Math.round((progressEvent.loaded / progressEvent.total) * 72);
      onProgress?.(Math.max(8, Math.min(progress, 72)));
    },
  });

  onProgress?.(100);
  return response.data;
}
