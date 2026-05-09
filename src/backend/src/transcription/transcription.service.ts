import { Injectable } from '@nestjs/common';

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
    const result = await nodewhisper(audioPath, {
      modelName: "tiny.en",
      autoDownloadModelName: undefined,
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
