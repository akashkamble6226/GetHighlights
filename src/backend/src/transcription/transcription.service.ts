import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { nodewhisper } from 'nodejs-whisper';

@Injectable()
export class TranscriptionService {
  private parseTranscript(transcript: string) {
    const lines = transcript.split('\n');

    const parsed: {
      start: string;
      end: string;
      text: string;
    }[] = [];

    for (const line of lines) {
      const match = line.match(/\[(.*?) --> (.*?)\]\s*(.*)/);

      if (match) {
        parsed.push({
          start: match[1],
          end: match[2],
          text: match[3],
        });
      }
    }

    return parsed;
  }

  async transcribeAudio(audioPath: string) {
    // Use custom model path from /models directory (pre-downloaded to avoid re-downloading)
    const modelRootPath = path.join(process.cwd(), 'models');

    const result = await nodewhisper(audioPath, {
      modelName: 'tiny.en',
      modelRootPath: modelRootPath,
      removeWavFileAfterTranscription: false,
      withCuda: false,
    });

    const parsedTranscript = this.parseTranscript(result);

    return {
      raw: result,
      transcript: parsedTranscript,
    };
  }
}
