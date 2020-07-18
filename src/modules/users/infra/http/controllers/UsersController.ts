import { Response, Request } from 'express';

import CreateUserService from '@modules/users/services/CreateUserService';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import UsersRepository from '../../typeorm/repositories/UsersRepository';

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, nickname, email, password } = request.body;

    console.log(name, nickname, email, password);

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
    });

    console.log(newUser);

    return response.json(newUser);
  }
}

export default UsersController;
