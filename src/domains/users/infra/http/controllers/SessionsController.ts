import { container } from 'tsyringe';
import { Request, Response } from 'express';

import AuthenticateUserService from '@domains/users/services/AuthenticateUserService';

class SessionsController {
  public async create(request: Request, response: Response) {
    const { login, password } = request.body;

    const authenticateUserService = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUserService.execute({
      login,
      password,
    });

    return response.json({ user, token });
  }
}

export default new SessionsController();
