import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";

import { FileInterceptor } from "@nestjs/platform-express";

import { diskStorage } from "multer";

import * as path from "path";
import * as fs from "fs";
import { TranscriptionService } from "./transcription/transcription.service";
import { VideoProcessingService } from "./video-processing/video-processing.service";



@Controller()
export class UploadController {
  constructor(
    private readonly videoProcessingService: VideoProcessingService,

    private readonly transcriptionService: TranscriptionService,
  ) {}

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("video", {
      storage: diskStorage({
        destination: "./uploads",

        filename: (req, file, callback) => {
          const uniqueName = `${Date.now()}-${
            file.originalname
          }`;

          callback(null, uniqueName);
        },
      }),
    })
  )
  async uploadVideo(
    @UploadedFile()
    file: Express.Multer.File
  ) {
    console.log(file);

    const videoPath = file.path;

    const audioFileName = `${Date.now()}.mp3`;

    const audioPath = path.join(
      process.cwd(),
      "uploads",
      "audio",
      audioFileName,
    );

    const extractedAudioPath =
      await this.videoProcessingService.extractAudio(
        videoPath,
        audioPath
      );

    const transcriptResult =
      await this.transcriptionService.transcribeAudio(
        extractedAudioPath
      );

    // Clean up uploads and audio folders
    const uploadsPath = path.join(process.cwd(), "uploads");

    // Delete files in audio folder
    if (fs.existsSync(audioPath)) {
      const audioDir = path.dirname(audioPath);
      if (fs.existsSync(audioDir)) {
        const audioFiles = fs.readdirSync(audioDir);
        for (const file of audioFiles) {
          const filePath = path.join(audioDir, file);
          if (fs.statSync(filePath).isFile()) {
            fs.unlinkSync(filePath);
          }
        }
      }
    }

    // Delete files in uploads folder (but not subdirectories)
    if (fs.existsSync(uploadsPath)) {
      const uploadFiles = fs.readdirSync(uploadsPath);
      for (const file of uploadFiles) {
        const filePath = path.join(uploadsPath, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      }
    }

    return {
      success: true,

      transcript: transcriptResult.transcript,
    };
  }
}