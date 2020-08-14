import { container } from 'tsyringe';
import { Request, Response } from 'express';

import AuthenticateUserService from '@domains/users/services/AuthenticateUserService';

import { classToClass } from 'class-transformer';

class SessionsController {
  public async create(request: Request, response: Response) {
    const { login, password } = request.body;

    const authenticateUserService = container.resolve(AuthenticateUserService);

    const { user, token, user_type } = await authenticateUserService.execute({
      login,
      password,
    });

    return response.json({ user: classToClass(user), token, user_type });
  }
}

export default new SessionsController();
