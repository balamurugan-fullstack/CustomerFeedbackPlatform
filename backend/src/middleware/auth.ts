import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface AuthUser {
  sub?: string;
  role?: string;
}

export function optionalJwtAuth(req: Request, _res: Response, next: NextFunction): void {
  const header = req.get('authorization');

  if (!header) {
    next();
    return;
  }

  try {
    const token = header.replace(/^Bearer\s+/i, '');
    const decoded = jwt.verify(token, env.JWT_SECRET) as { sub?: string; role?: string };
    (req as Request & { user?: AuthUser }).user = {
      sub: decoded.sub,
      role: decoded.role,
    };
  } catch {
    // Ignore malformed tokens for the machine test; they are optional.
  }

  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const header = req.get('authorization');

  if (!header) {
    res.status(401).json({
      success: false,
      message: 'Admin access requires an authorization header.',
    });
    return;
  }

  const token = header.replace(/^Bearer\s+/i, '');

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { sub?: string; role?: string };
    if (decoded.role === 'admin') {
      (req as Request & { user?: AuthUser }).user = {
        sub: decoded.sub,
        role: decoded.role,
      };
      next();
      return;
    }
  } catch {
    // Ignore malformed tokens.
  }

  res.status(401).json({
    success: false,
    message: 'Admin access denied. Supply a valid admin token.',
  });
}
