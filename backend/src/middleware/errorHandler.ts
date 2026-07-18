import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  let statusCode = 500;
  let message = 'Internal server error';
  let details: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    details = err.flatten();
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid identifier format';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Database validation failed';
    details = err.message;
  } else if (err.name === 'MongoServerError' || err.name === 'MongoError') {
    statusCode = 400;
    message = 'Database operation failed';
    details = err.message;
  } else if (err instanceof SyntaxError && 'body' in err) {
    statusCode = 400;
    message = 'Malformed JSON payload';
  }

  if (statusCode >= 500) {
    logger.error('Unhandled error', { error: err.message, stack: err.stack, requestId: req.id });
  } else {
    logger.warn('Client error', { statusCode, message, details, requestId: req.id });
  }

  res.status(statusCode).json({
    success: false,
    message,
    requestId: req.id,
    ...(details !== undefined && { details }),
    ...(env.NODE_ENV === 'development' && statusCode >= 500 && { stack: err.stack }),
  });
}
