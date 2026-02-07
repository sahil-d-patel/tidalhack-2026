import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error:', err.message);

  const isDevelopment = process.env.NODE_ENV !== 'production';

  res.status(500).json({
    error: {
      message: err.message || 'Internal server error',
      ...(isDevelopment && { stack: err.stack })
    }
  });
}
