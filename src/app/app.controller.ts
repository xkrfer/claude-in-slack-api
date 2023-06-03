import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Res,
  Logger,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ICompletionsData, STATUS } from '../types/types';
import { Response } from 'express';
const logger = new Logger('AppController');
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/v1/chat/completions')
  @HttpCode(200)
  async chat(@Body() body: ICompletionsData, @Res() res: Response) {
    const { stream = false, messages = [] } = body;
    const message = await this.appService.transformMessage(messages);
    /**
     *  claude in slack
     * */
    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      if (process.env.SPLIT_STREAM !== 'false') {
        return await this.appService.getSlackChatCompletionStream(
          message,
          (completion, status) => {
            res.write(`data: ${completion}\n\n`);
            if (status === STATUS.STOP) {
              res.end();
            }
          },
        );
      } else {
        const completion = await this.appService.getSlackChatCompletion(
          message,
        );
        res.write(`data: ${JSON.stringify(completion)}\n\n`);
        return res.end();
      }
    }
    const response = await this.appService.getSlackChatCompletion(message);
    return res.json(response);
  }
}
