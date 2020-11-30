import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import User from '@domains/users/infra/typeorm/entities/User';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/rules/IHashProvider';

interface IRequest {
  user_id: string;
  name: string;
  nickname?: string;
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
    user_id,
    name,
    nickname,
    email,
    oldpassword,
    password,
    password_confirmation,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found');

    let checkNickNameExists: User | undefined;

    if (nickname) {
      checkNickNameExists = await this.usersRepository.findByNickname(nickname);
      if (checkNickNameExists && checkNickNameExists.id !== user_id) {
        throw new AppError('Nickname already used');
      }
      if (user instanceof User) {
        user.nickname = nickname;
      }
    }

    const checkEmailExists = await this.usersRepository.findByEmail(email);

    if (checkEmailExists && checkEmailExists.id !== user_id) {
      throw new AppError('Email already used');
    }

    user.name = name;
    user.email = email;

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

    await this.usersRepository.update(user);

    return user;
  }
}

export default UpdateProfileService;
