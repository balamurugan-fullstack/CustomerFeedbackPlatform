import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const isHealthy = dbState === 1;

  res.status(200).json({
    success: true,
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStatusMap[dbState] ?? 'unknown',
    },
  });
});

router.get('/ready', (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const isReady = dbState === 1;

  res.status(isReady ? 200 : 503).json({
    success: isReady,
    status: isReady ? 'ready' : 'not-ready',
    timestamp: new Date().toISOString(),
    database: {
      status: dbState === 1 ? 'connected' : 'unavailable',
    },
  });
});

export default router;
