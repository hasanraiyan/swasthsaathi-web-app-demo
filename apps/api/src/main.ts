import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { clerkMiddleware } from '@clerk/express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for mobile app & web
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // Clerk Express middleware
  app.use(clerkMiddleware());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 SwasthSaathi API is running on: http://localhost:${port}`);
}
bootstrap();
