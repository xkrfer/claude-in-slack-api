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
@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, SlackClient],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/v1/chat/completions',
      method: RequestMethod.POST,
    });
  }
}
