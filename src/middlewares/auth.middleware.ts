import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import {ENV} from "../utils/const";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).send({
        message: 'Unauthorized',
      });
      return;
    }
    const token = authHeader.split(' ')[1];
    if (ENV.TOKEN !== token) {
      res.status(403).send({
        message: 'Invalid Token',
      });
      return;
    }

    if (!ENV.SLACK_USER_TOKEN) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Invalid SLACK_USER_TOKEN',
      });
      return;
    }

    if (!ENV.CLAUDE_BOT_ID) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Invalid CLAUDE_BOT_ID',
      });
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
