import { Injectable } from '@nestjs/common';

import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from 'ffmpeg-static';

import * as fs from 'fs';
import * as path from 'path';

ffmpeg.setFfmpegPath(ffmpegPath as string);

@Injectable()
export class VideoProcessingService {
  extractAudio(videoPath: string, outputAudioPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const absoluteOutputPath = path.resolve(outputAudioPath);

      const outputDir = path.dirname(absoluteOutputPath);

      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, {
          recursive: true,
        });
      }

      console.log('Video path:', videoPath);

      console.log('Output audio path:', absoluteOutputPath);

      ffmpeg(videoPath)
        .noVideo()
        .audioCodec('libmp3lame')
        .format('mp3')
        .save(absoluteOutputPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg started:');

          console.log(commandLine);
        })
        .on('end', () => {
          console.log('Audio extraction completed');

          console.log('Audio exists:', fs.existsSync(absoluteOutputPath));

          resolve(absoluteOutputPath);
        })
        .on('error', (err) => {
          console.error('FFmpeg Error:');

          console.error(err);

          reject(err);
        });
    });
  }
}
