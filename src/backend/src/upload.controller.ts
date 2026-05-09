import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";

import { FileInterceptor } from "@nestjs/platform-express";

import { diskStorage } from "multer";

import * as path from "path";
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

    return {
      success: true,

      transcript: transcriptResult.transcript,
    };
  }
}