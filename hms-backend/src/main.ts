import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import  cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — allow frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
  });

  // Global prefix — all routes start with /api/v1
  app.setGlobalPrefix('api/v1');

  // Auto-validate incoming request bodies
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));

  // Parse cookies
  app.use(cookieParser());

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`HMS Backend running on http://localhost:${port}/api/v1`);
}
bootstrap();