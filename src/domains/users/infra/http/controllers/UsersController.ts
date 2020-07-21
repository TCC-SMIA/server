import { Response, Request } from 'express';

import CreateUserService from 'domains/users/services/CreateUserService';
import BCryptHashProvider from 'domains/users/providers/HashProvider/implementations/BCryptHashProvider';
import UsersRepository from '../../typeorm/repositories/UsersRepository';

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, nickname, email, password, type } = request.body;

    const usersRepository = new UsersRepository();

    const hashProvider = new BCryptHashProvider();

    const createUserService = new CreateUserService(
      usersRepository,
      hashProvider,
    );

    const newUser = await createUserService.execute({
      name,
      nickname,
      email,
      password,
      type,
    });

    return response.json(newUser);
  }
}

export default new UsersController();
