import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:3000",
  "https://get-highlights-gclv.vercel.app",
];

const vercelPreviewOriginPattern = /^https:\/\/get-highlights[-\w]*\.vercel\.app$/;

function getAllowedOrigins() {
  const configuredOrigins = process.env.CORS_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set([...(configuredOrigins ?? []), ...defaultAllowedOrigins]);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = getAllowedOrigins();

  app.enableCors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const isAllowed =
        allowedOrigins.has(origin) || vercelPreviewOriginPattern.test(origin);

      callback(null, isAllowed);
    },
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Accept",
      "Authorization",
      "Content-Type",
      "Origin",
      "X-Requested-With",
    ],
    maxAge: 86_400,
    optionsSuccessStatus: 204,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
