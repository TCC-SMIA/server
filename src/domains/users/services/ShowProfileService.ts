import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import User from '@domains/users/infra/typeorm/entities/User';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  userId: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ userId }: IRequest): Promise<User> {
    const checkUserExists = await this.usersRepository.findById(userId);

    if (!checkUserExists) {
      throw new AppError('User not found');
    }

    return checkUserExists;
  }
}

export default ShowProfileService;
