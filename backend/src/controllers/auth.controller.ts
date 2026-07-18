import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export async function loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
      return;
    }

    if (email !== env.ADMIN_EMAIL || password !== env.ADMIN_PASSWORD) {
      res.status(401).json({
        success: false,
        message: 'Invalid admin credentials.',
      });
      return;
    }

    jwt.sign({ sub: email, role: 'admin' }, env.JWT_SECRET, (error: Error | null, encoded?: string) => {
      if (error || !encoded) {
        res.status(500).json({
          success: false,
          message: 'Unable to create admin token.',
        });
        return;
      }

      res.status(200).json({
        success: true,
        token: encoded,
        message: 'Admin authentication successful.',
      });
    });
  } catch (error) {
    next(error);
  }
}
