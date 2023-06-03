import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';
import { getEnvPath } from './utils/utils';
import { Logger } from '@nestjs/common';
const logger = new Logger('Main');
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
bootstrap().then(() => {
  logger.log('server start at http://127.0.0.1:9000');
});
