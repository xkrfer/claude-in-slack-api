import { Injectable } from '@nestjs/common';
import { WebClient, WebClientOptions } from '@slack/web-api';
import {END_TEXT, ENV, MAX_RETRIES} from '../utils/const';
import { ICallback, STATUS } from '../types/types';
@Injectable()
export class SlackClient {
  private client: WebClient;
  private CHANNEL_ID: string | null = null;
  private LAST_TS: string | null = null;

  constructor() {
    const options: WebClientOptions = {};
    this.client = new WebClient(ENV.SLACK_USER_TOKEN, options);
  }

  async chat(text: string): Promise<void> {
    if (!this.CHANNEL_ID) {
      throw new Error('Channel not found.');
    }

    try {
      const response = await this.client.chat.postMessage({
        channel: this.CHANNEL_ID,
        text: text,
      });
      this.LAST_TS = response.ts as string;
    } catch (error) {
      console.error('Error posting message:', error);
    }
  }
  async openChannel(): Promise<void> {
    if (!this.CHANNEL_ID) {
      try {
        const response = await this.client.conversations.open({
          users: ENV.CLAUDE_BOT_ID,
        });
        this.CHANNEL_ID = response.channel?.id as string;
      } catch (error) {
        console.error('Error opening channel:', error);
      }
    }
  }

  async getReply(
    data?: {
      count: number;
      prevCompletion?: string;
    },
    callback?: ICallback,
  ): Promise<string> {
    const { count = 0, prevCompletion = '' } = data || { count: 0 };
    if (count > MAX_RETRIES) {
      throw new Error('Get reply timeout');
    }
    try {
      const response = await this.client.conversations.history({
        channel: this.CHANNEL_ID,
        oldest: this.LAST_TS,
        limit: 2,
      });
      const messages = response.messages as Array<any>;
      const filteredMessages = messages.filter(
        (msg) => msg.user === ENV.CLAUDE_BOT_ID,
      );
      const lastMessage = filteredMessages[filteredMessages.length - 1];
      const lastMessageText: string = lastMessage?.text ?? '';
      const nextCompletion = lastMessageText
        .replace(END_TEXT, '')
        .replace(prevCompletion, '')
        .trim();
      if (lastMessage && !lastMessage.text.endsWith(END_TEXT)) {
        callback && callback(nextCompletion, STATUS.STOP);
        return nextCompletion;
      }
      callback && callback(nextCompletion, STATUS.CONTINUE);
      /**
       * 暂停1s再发起请求
       * */
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await this.getReply(
        {
          count: count + 1,
          prevCompletion: lastMessageText.replace(END_TEXT, '').trim(),
        },
        callback,
      );
    } catch (error) {
      console.error('Error getting reply:', error);
    }
  }
}
