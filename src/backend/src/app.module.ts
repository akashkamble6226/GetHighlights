import { Module } from "@nestjs/common";
import { UploadController } from "./upload.controller";
import { VideoProcessingService } from "./video-processing/video-processing.service";
import { ConfigModule } from "@nestjs/config";
import { TranscriptionService } from "./transcription/transcription.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [UploadController],
  providers: [VideoProcessingService, TranscriptionService],
})
export class AppModule {}
