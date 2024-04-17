import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as bodyParser from 'body-parser';
// Express
import * as express from 'express';
import { FOLDER_UPLOADS, FOLDER_STATIC, FOLDER_FRONTEND } from './config/path.config';
import { join } from 'path';
import { NodemailerInit } from './assets/nodemailer.assets';
import { HbsInit } from './assets/hbs.assets';
import { NestExpressApplication } from '@nestjs/platform-express';
import { URL_Server } from './config/server.config';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const options = {
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false,
    'optionsSuccessStatus': 204,
    'credentials': true,
  };

  // the next two lines did the trick
  // app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

  // Habilitamos el CORS
  // app.use(cors(options))
  app.enableCors(options);

  app.use(express.static(join(FOLDER_UPLOADS)));

  app.use(express.static(join(FOLDER_STATIC)));

  app.use(express.static(join(FOLDER_FRONTEND)));

  // Inicializo el hbs
  HbsInit(app);

  // Inicializo el serverNodemailer
  NodemailerInit();
  
  await app.listen(URL_Server.puertoBackend);
}
bootstrap();
