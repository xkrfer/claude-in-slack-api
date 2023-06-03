import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('RequestLoggerMiddleware');
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const start = Date.now();
    res.on('finish', () => {
      const { statusCode } = res;
      const responseTime = Date.now() - start;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${ip} - ${responseTime}ms`,
      );
    });
    next();
  }
}
