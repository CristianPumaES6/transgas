import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Express
import * as express from 'express';
import { FOLDER_UPLOADS,FOLDER_STATIC, FOLDER_FRONTEND } from './config/path.config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = {
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    'optionsSuccessStatus': 204,
    'credentials': true,
  };
  
  // Habilitamos el CORS
  // app.use(cors(options))
  app.enableCors(options);

  app.use(express.static(join(FOLDER_UPLOADS)));

  app.use(express.static(join(FOLDER_STATIC)));

  app.use(express.static(join(FOLDER_FRONTEND)));

  await app.listen(3000);
}
bootstrap();
