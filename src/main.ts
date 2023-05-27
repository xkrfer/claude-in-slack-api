import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';
import {getEnvPath} from "./utils/utils";
async function bootstrap() {
  dotenv.config({
    path: getEnvPath(),
  });
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(9000);
}
bootstrap();
