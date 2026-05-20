import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000',
  'https://get-highlights-gclv.vercel.app',
  'https://gethighlights.onrender.com',
];

const vercelPreviewOriginPattern =
  /^https:\/\/get-highlights[-\w]*\.vercel\.app$/;

function getAllowedOrigins() {
  const configuredOrigins = process.env.CORS_ORIGINS?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return new Set([...(configuredOrigins ?? []), ...defaultAllowedOrigins]);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = getAllowedOrigins();

  app.enableCors({
    origin(origin, callback) {
      // Allow non-browser requests (like curl, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }

      const isAllowed =
        allowedOrigins.has(origin) || vercelPreviewOriginPattern.test(origin);

      // Log CORS decisions in development
      if (process.env.NODE_ENV !== 'production') {
        console.log(`CORS check for origin "${origin}": ${isAllowed ? 'ALLOWED' : 'BLOCKED'}`);
      }

      if (isAllowed) {
        return callback(null, true);
      }

      return callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'Origin',
      'X-Requested-With',
    ],
    exposedHeaders: ['Content-Length', 'X-JSON-Response-Body'],
    maxAge: 86400,
    optionsSuccessStatus: 200,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server is running on http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
