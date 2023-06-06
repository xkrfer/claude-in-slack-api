import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import * as path from 'path';
const logger = new Logger('Main');
const isProd = process.env.NODE_ENV !== 'development';
async function bootstrap() {
  dotenv.config({
    path: isProd
      ? path.resolve(__dirname, '../config/.env')
      : path.resolve(__dirname, '../config/.env.local'),
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
  /** show env variable  */
  logger.log(`env: ${process.env.NODE_ENV}`);
  logger.log(`slack bot id: ${process.env.CLAUDE_BOT_ID}`);
  logger.log(`slack user token: ${process.env.SLACK_USER_TOKEN}`);
  logger.log(`server token: ${process.env.TOKEN}`);
  logger.log(`split stream: ${process.env.SPLIT_STREAM}`);
  logger.log('server start at http://127.0.0.1:9000');
});
