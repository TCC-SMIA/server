import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import User from '@domains/users/infra/typeorm/entities/User';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/rules/IHashProvider';

interface IRequest {
  userId: string;
  name: string;
  nickname: string;
  email: string;
  oldpassword?: string;
  password?: string;
  password_confirmation?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({
    userId,
    name,
    nickname,
    email,
    oldpassword,
    password,
    password_confirmation,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found');
    }

    const checkNickNameExists = await this.usersRepository.findByNickname(
      nickname,
    );

    if (checkNickNameExists && checkNickNameExists.id !== userId) {
      throw new AppError('Nickname already used');
    }

    const checkEmailExists = await this.usersRepository.findByEmail(email);

    if (checkEmailExists && checkEmailExists.id !== userId) {
      throw new AppError('Email already used');
    }

    user.name = name;
    user.email = email;
    user.nickname = nickname;

    if (password && !oldpassword) {
      throw new AppError(
        'To update password is necessary to confirm the old password.',
      );
    }
    if (password && oldpassword) {
      const passwordMatched = await this.hashProvider.compareHash(
        oldpassword,
        user.password,
      );

      if (!passwordMatched) {
        throw new AppError('Old password is wrong.');
      }

      if (password !== password_confirmation) {
        throw new AppError(
          'Password and password_confirmation must be the same',
        );
      }

      user.password = await this.hashProvider.generateHash(password);
    }
    const updatedUser = await this.usersRepository.update(user);

    return updatedUser;
  }
}

export default UpdateProfileService;
