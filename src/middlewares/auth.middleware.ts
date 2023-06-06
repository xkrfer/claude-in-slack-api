import { HttpStatus, Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
const logger = new Logger('AuthMiddleware');
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const TOKEN = this.configService.get<string>('TOKEN');
    const SLACK_USER_TOKEN = this.configService.get<string>('SLACK_USER_TOKEN');
    const CLAUDE_BOT_ID = this.configService.get<string>('CLAUDE_BOT_ID');
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).send({
        message: 'Unauthorized',
      });
      logger.error('Unauthorized');
      return;
    }
    const token = authHeader.split(' ')[1];
    if (TOKEN !== token) {
      res.status(403).send({
        message: 'Invalid Token',
      });
      logger.error('Invalid Token', token, TOKEN);
      return;
    }

    if (!SLACK_USER_TOKEN) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Invalid SLACK_USER_TOKEN',
      });
      logger.error('Invalid SLACK_USER_TOKEN');
      return;
    }

    if (!CLAUDE_BOT_ID) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Invalid CLAUDE_BOT_ID',
      });
      logger.error('Invalid CLAUDE_BOT_ID');
      return;
    }
    try {
      next();
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Internal Server Error',
      });
    }
  }
}
