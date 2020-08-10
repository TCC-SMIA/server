import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../rules/IUsersRepository';

interface IRequest {
  userId: string;
}

@injectable()
class DeleteProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId }: IRequest): Promise<void> {
    const findUser = await this.usersRepository.findById(userId);

    if (!findUser) {
      throw new AppError('User not found.');
    }

    await this.usersRepository.delete(findUser);
  }
}

export default DeleteProfileService;
