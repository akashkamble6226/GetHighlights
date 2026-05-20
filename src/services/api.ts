import axios, { type AxiosProgressEvent } from "axios";

import type { UploadResponse } from "@/types/api";

// Determine the base URL based on environment variables
// Priority:
// 1. VITE_API_URL environment variable (from .env files)
// 2. Fallback to localhost:3000 in development
// 3. Fallback to Render production URL
const getBaseURL = () => {
  // First priority: VITE_API_URL from environment
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, "");
  }

  // Second priority: localhost development
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    return "http://localhost:3000";
  }

  // Third priority: Render production as fallback
  return "https://gethighlights.onrender.com";
};

const baseURL = getBaseURL();

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
