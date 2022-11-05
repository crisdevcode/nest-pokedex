import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global prefix api
  app.setGlobalPrefix('api/v2')

  // Global Pipes
  app.useGlobalPipes(
    // Data validator
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      })
    );

  // Server
  await app.listen(3000);
}
bootstrap();
