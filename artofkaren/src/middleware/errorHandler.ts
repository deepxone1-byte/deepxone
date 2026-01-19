import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    statusCode,
    path: req.path,
    method: req.method
  });

  if (process.env.NODE_ENV === 'production') {
    res.status(statusCode).json({
      error: message,
      statusCode
    });
  } else {
    res.status(statusCode).json({
      error: message,
      statusCode,
      stack: err.stack
    });
  }
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path
  });
};
