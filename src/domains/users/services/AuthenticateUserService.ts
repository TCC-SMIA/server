import 'reflect-metadata';
import { sign } from 'jsonwebtoken';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import authConfig from '@config/authConfig';
import AppError from '@shared/errors/AppError';
import User from '@domains/users/infra/typeorm/entities/User';
import { injectable, inject } from 'tsyringe';

interface IRequest {
  email?: string;
  nickname?: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    nickname,
    password,
  }: IRequest): Promise<IResponse> {
    let user: User | undefined;
    if (email) {
      user = await this.usersRepository.findByEmail(email);
    }
    if (nickname) {
      user = await this.usersRepository.findByNickname(nickname);
    }
    if (!user) {
      throw new AppError('User was not found.');
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect combination for login');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
