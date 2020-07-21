import { Request, Response } from 'express';

import AuthenticateUserService from '@domains/users/services/AuthenticateUserService';
import BCryptHashProvider from '@domains/users/providers/HashProvider/implementations/BCryptHashProvider';
import UsersRepository from '../../typeorm/repositories/UsersRepository';

class SessionsController {
  public async create(request: Request, response: Response) {
    const { email, nickname, password } = request.body;

    const usersRepository = new UsersRepository();

    const hashProvider = new BCryptHashProvider();

    const authenticateUserService = new AuthenticateUserService(
      usersRepository,
      hashProvider,
    );

    const { user, token } = await authenticateUserService.execute({
      email,
      nickname,
      password,
    });

    return response.json({ user, token });
  }
}

export default new SessionsController();
