import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@domains/users/services/CreateUserService';
import ShowProfileService from '@domains/users/services/ShowProfileService';
import UpdateProfileService from '@domains/users/services/UpdateProfileService';

import { classToClass } from 'class-transformer';
import DeleteProfileService from '@domains/users/services/DeleteProfileService';

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

    return response.json(classToClass(newUser));
  }

  async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const {
      name,
      nickname,
      email,
      oldpassword,
      password,
      password_confirmation,
    } = request.body;

    const updateProfileService = container.resolve(UpdateProfileService);

    const user = await updateProfileService.execute({
      user_id,
      name,
      nickname,
      email,
      oldpassword,
      password,
      password_confirmation,
    });

    return response.json(user);
  }

  async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const showProfileService = container.resolve(ShowProfileService);

    const user = await showProfileService.execute({ userId });

    return response.json(classToClass(user));
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const deleteProfileService = container.resolve(DeleteProfileService);

    await deleteProfileService.execute({ userId });

    return response.status(204).json();
  }
}

export default new UsersController();
