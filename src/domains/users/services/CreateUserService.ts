import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import User from 'domains/users/infra/typeorm/entities/User';

import IUsersRepository from 'domains/users/rules/IUsersRepository';
import IHashProvider from 'domains/users/providers/HashProvider/rules/IHashProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  nickname: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({ name, nickname, email, password }: IRequest): Promise<User> {
    const checkEmailExists = await this.usersRepository.findByEmail(email);

    if (checkEmailExists) {
      throw new AppError('Email already exists');
    }

    const checkNicknameExists = await this.usersRepository.findByNickname(
      nickname,
    );

    if (checkNicknameExists) {
      throw new AppError('Nickname already used');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      nickname,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
