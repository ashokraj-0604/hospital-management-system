import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError(401, 'Authorization header is required', 'MISSING_AUTHORIZATION');
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      throw new AppError(401, 'Invalid authorization header format', 'INVALID_AUTHORIZATION_FORMAT');
    }

    const token = parts[1];
    const payload = verifyAccessToken(token);

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN',
      });
    }
  }
};
