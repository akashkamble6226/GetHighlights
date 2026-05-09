export interface TranscriptSegment {
  start: string;
  end: string;
  text: string;
}

export interface UploadResponse {
  success: boolean;
  transcript: TranscriptSegment[];
  raw?: string;
  fileName?: string;
}
