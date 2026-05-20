import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { nodewhisper } from 'nodejs-whisper';

@Injectable()
export class TranscriptionService {
  private readonly modelName = process.env.WHISPER_MODEL ?? 'tiny.en';

  private readonly modelRootPath = this.resolveModelRootPath();

  private resolveModelRootPath() {
    if (process.env.WHISPER_MODEL_ROOT) {
      return path.resolve(process.env.WHISPER_MODEL_ROOT);
    }

    const modelFileName = `ggml-${this.modelName}.bin`;
    const candidates = [
      path.join(process.cwd(), 'models'),
      path.resolve(__dirname, '..', 'models'),
      path.resolve(__dirname, '..'),
    ];

    return (
      candidates.find((candidate) =>
        fs.existsSync(path.join(candidate, modelFileName)),
      ) ?? candidates[0]
    );
  }

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
      modelName: this.modelName,
      autoDownloadModelName: this.modelName,
      modelRootPath: this.modelRootPath,
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
