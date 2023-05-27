import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ICompletionsData, STATUS } from '../types/types';
import { Response, Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/v1/chat/completions')
  @HttpCode(200)
  async chat(
    @Body() body: ICompletionsData,
    @Res() res: Response,
    @Req() request: Request,
  ) {
    const { stream = false, messages = [] } = body;
    const message = await this.appService.transformMessage(messages);
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      return await this.appService.getChatCompletionStream(
        message,
        (completion, status) => {
          res.write(`data: ${completion}\n\n`);
          if (status === STATUS.STOP) {
            res.end();
          }
        },
      );
    }
    const response = await this.appService.getChatCompletion(message);
    return res.json(response);
  }
}
