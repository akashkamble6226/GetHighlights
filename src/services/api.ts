import axios, { type AxiosProgressEvent } from "axios";

import type { UploadResponse } from "@/types/api";

// In production, uses VITE_API_URL from Vercel env vars
// Fallback to Railway backend if env var not set
// In development, falls back to localhost:3000
const baseURL = (
  import.meta.env.VITE_API_URL || "https://gethighlights-production.up.railway.app"
).replace(/\/$/, "");

console.log("API Base URL:", baseURL);

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
