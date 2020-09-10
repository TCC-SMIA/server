import { NextFunction, Request, Response } from 'express';
import AppError from '@shared/errors/AppError';

const globalErrorsMiddleware = (
  err: Error,
  _request: Request,
  response: Response,
  _: NextFunction,
): Response => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // eslint-disable-next-line no-console
  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

export default globalErrorsMiddleware;
