import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { isAfter, addHours } from 'date-fns';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IUserTokensRepository from '@domains/users/rules/IUserTokensRepository';

import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/rules/IHashProvider';

interface IRequest {
  token: string;
  password: string;
  password_confirmation: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    token,
    password,
    password_confirmation,
  }: IRequest): Promise<void> {
    if (password !== password_confirmation) {
      throw new AppError(
        'Password and Password confirmation must be the same.',
      );
    }

    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('User token does not exists');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    const tokenCreatedAt = userToken.created_at;

    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError('Token expired.');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.update(user);
  }
}

export default ResetPasswordService;
