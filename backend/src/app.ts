import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { apiRateLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { optionalJwtAuth, requireAdmin } from './middleware/auth';
import { monitoringMiddleware } from './middleware/monitoring';
import { requestIdMiddleware } from './middleware/requestId';
import feedbackRoutes from './routes/feedback.routes';
import analyticsRoutes from './routes/analytics.routes';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';

export function createApp(): Application {
  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN.split(','),
      credentials: true,
    })
  );
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(requestIdMiddleware);
  app.use(monitoringMiddleware);
  app.use(optionalJwtAuth);

  app.use('/health', requireAdmin, healthRoutes);
  app.use('/api', apiRateLimiter);
  app.use('/api/auth', authRoutes);
  app.use('/api/feedback', feedbackRoutes);
  app.use('/api/analytics', requireAdmin, analyticsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
