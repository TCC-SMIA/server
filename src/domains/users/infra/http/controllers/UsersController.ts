import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateUserService from 'domains/users/services/CreateUserService';

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, nickname, email, password } = request.body;

    const createUserService = container.resolve(CreateUserService);

    const newUser = await createUserService.execute({
      name,
      nickname,
      email,
      password,
    });

    return response.json(newUser);
  }
}

export default new UsersController();
