import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

export function monitoringMiddleware(req: Request, res: Response, next: NextFunction): void {
  const startedAt = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    logger.info('Request completed', {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      requestId: req.id,
    });
  });

  next();
}
