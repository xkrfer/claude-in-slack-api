export interface IMessage {
  role: string;
  content: string;
}

export enum STATUS {
  STOP = 0,
  CONTINUE = 1,
}

export interface ICompletionsData {
  model: string;
  messages: IMessage[];
  max_tokens: number;
  temperature: number;
  stream: boolean;
}

export interface ICallback {
  (message: string, status: STATUS): void;
}
