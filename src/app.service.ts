import { Injectable } from '@nestjs/common';
import { ICallback, IMessage, STATUS } from './types';
import { HttpService } from '@nestjs/axios';
import { SlackClient } from './slack.client';
import { generateResponse } from './utils';

const role_map = {
  system: 'Human',
  user: 'Human',
  assistant: 'Assistant',
};
@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private readonly slackClient: SlackClient,
  ) {}
  getHello(): string {
    return `Hello World!`;
  }

  async transformMessage(messages: IMessage[]) {
    return messages.reduce((acc, message) => {
      if (role_map[message.role] === 'Human') {
        acc += `Human: ${message.content}\n`;
      } else {
        acc += `Assistant: ${message.content}\n`;
      }
      return acc;
    }, '');
  }

  async getChatCompletionStream(message: string, callback: ICallback) {
    await this.slackClient.openChannel();
    await this.slackClient.chat(message);
    const timestamp = Math.floor(Date.now() / 1000);
    await this.slackClient.getReply(null, (message, status) => {
      if (status === STATUS.CONTINUE && message === '') return;
      const completion = JSON.stringify(
        generateResponse(
          {
            timestamp,
            stream: true,
            completion: message,
          },
          status,
        ),
      );
      callback(completion, status);
    });
  }

  async getChatCompletion(message: string) {
    await this.slackClient.openChannel();
    await this.slackClient.chat(message);
    const timestamp = Math.floor(Date.now() / 1000);
    const completion = await this.slackClient.getReply();
    return generateResponse({
      timestamp,
      stream: false,
      completion,
    });
  }
}
