import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up reading from .env
  const config = app.get<ConfigService>(ConfigService);

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // filter out properties not included in the schema
      transform: true, // automatically transform JSON object into DTO object types
    }),
  );

  // Swagget Configuration
  const configDocs = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Coding Challenge')
    .setDescription('API for the coding challenge')
    .setVersion('1.0')
    .addTag('bdswiss')
    .build();
  const document = SwaggerModule.createDocument(app, configDocs);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.get<string>('PORT') || 3000);
}
bootstrap();
