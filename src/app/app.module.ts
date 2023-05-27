import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { SlackClient } from '../clients/slack.client';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [HttpModule,ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, SlackClient,ConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/v1/chat/completions',
      method: RequestMethod.POST,
    });
  }
}
