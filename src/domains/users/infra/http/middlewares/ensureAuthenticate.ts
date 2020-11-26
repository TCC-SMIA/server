import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import AppError from '@shared/errors/AppError';
import authConfig from '@config/authConfig';

interface ITokenInfo {
  iat: number;
  exp: number;
  sub: string;
}

const ensureAuthenticate = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Missing JWT token', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const tokenInfo = verify(token, authConfig.jwt.secret);

    const { sub } = tokenInfo as ITokenInfo;

    request.user = { id: sub };

    next();
  } catch (error) {
    response.json({ status: '401', message: 'Unauthorized' });
  }
};

export default ensureAuthenticate;
