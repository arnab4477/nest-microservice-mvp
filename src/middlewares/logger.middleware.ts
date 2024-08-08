import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      console.info({
        method: req.method,
        originalUrl: req.originalUrl,
        statusCode: res.statusCode,
        time: new Date().toISOString(),
      });
    });

    next();
  }
}
