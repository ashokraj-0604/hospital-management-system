import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
};
