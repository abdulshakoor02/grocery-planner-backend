import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../service/logger.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, originalUrl } = req;

    // Log when request completes
    res.on('finish', () => {
      const statusCode = res.statusCode;
      this.logger.logRequest(method, originalUrl, startTime, statusCode);
    });

    // Log errors
    res.on('error', (err) => {
      this.logger.error('HTTP Request Error', {
        method,
        url: originalUrl,
        error: err.message,
      });
    });

    next();
  }
}