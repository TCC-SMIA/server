import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@domains/users/services/CreateUserService';
import ShowProfileService from '@domains/users/services/ShowProfileService';
import UpdateProfileService from '@domains/users/services/UpdateProfileService';

import { classToClass } from 'class-transformer';

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

  async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const {
      name,
      nickname,
      email,
      oldpassword,
      password,
      password_confirmation,
    } = request.body;

    const updateProfileService = container.resolve(UpdateProfileService);

    const updatedUser = await updateProfileService.execute({
      userId,
      name,
      nickname,
      email,
      oldpassword,
      password,
      password_confirmation,
    });

    return response.json(classToClass(updatedUser));
  }

  async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const showProfileService = container.resolve(ShowProfileService);

    const user = await showProfileService.execute({ userId });

    return response.json(classToClass(user));
  }
}

export default new UsersController();
