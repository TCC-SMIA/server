import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';
import { sign } from 'jsonwebtoken';
import Validator from 'validator';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import authConfig from '@config/authConfig';
import AppError from '@shared/errors/AppError';
import User from '@domains/users/infra/typeorm/entities/User';

interface IRequest {
  login: string;
  password: string;
}

interface IResponse {
  user: User;
  token: string;
  user_type: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ login, password }: IRequest): Promise<IResponse> {
    let user: User | undefined;

    const validEmail = Validator.isEmail(login);

    if (!validEmail) {
      user = await this.usersRepository.findByNickname(login);
    }

    if (validEmail) {
      user = await this.usersRepository.findByEmail(login);
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

    return { user: classToClass(user), token, user_type: user.type };
  }
}

export default AuthenticateUserService;
