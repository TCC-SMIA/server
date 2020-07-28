import { container } from 'tsyringe';
import { Request, Response } from 'express';

import AuthenticateUserService from '@domains/users/services/AuthenticateUserService';

import { classToClass } from 'class-transformer';

class SessionsController {
  public async create(request: Request, response: Response) {
    const { email, nickname, password, user_type } = request.body;

    const authenticateUserService = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUserService.execute({
      email,
      nickname,
      password,
      user_type,
    });

    return response.json({ user: classToClass(user), token });
  }
}

export default new SessionsController();
