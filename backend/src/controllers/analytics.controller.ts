import { NextFunction, Request, Response } from 'express';
import { getAnalytics } from '../services/analytics.service';

export async function getAnalyticsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const analytics = await getAnalytics();

    res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
}
