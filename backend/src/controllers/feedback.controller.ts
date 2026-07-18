import { NextFunction, Request, Response } from 'express';
import { createFeedback, getFeedback } from '../services/feedback.service';
import { CreateFeedbackInput, GetFeedbackQuery } from '../validators/feedback.validator';

export async function createFeedbackHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as CreateFeedbackInput;
    const feedback = await createFeedback(input);

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      data: feedback,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFeedbackHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const query = req.query as unknown as GetFeedbackQuery;
    const result = await getFeedback(query);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}
