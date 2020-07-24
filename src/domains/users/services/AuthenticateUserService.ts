import 'reflect-metadata';
import { sign } from 'jsonwebtoken';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import authConfig from '@config/authConfig';
import AppError from '@shared/errors/AppError';
import User from '@domains/users/infra/typeorm/entities/User';
import { injectable, inject } from 'tsyringe';
import { UserTypes } from '../enums/UserEnums';
import IAgencyRepository from '../rules/IAgencyRepository';
import Agency from '../infra/typeorm/entities/Agency';

interface IRequest {
  email?: string;
  nickname?: string;
  password: string;
  user_type: string;
}

interface IResponse {
  user: User | Agency;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('AgencyRepository')
    private agencyRepository: IAgencyRepository,
  ) {}

  public async execute({
    email,
    nickname,
    password,
    user_type,
  }: IRequest): Promise<IResponse> {
    let user: User | Agency | undefined;

    switch (user_type) {
      case UserTypes.Reporter:
        if (email) {
          user = await this.usersRepository.findByEmail(email);
        }
        if (nickname) {
          user = await this.usersRepository.findByNickname(nickname);
        }
        break;

      case UserTypes.EnvironmentalAgency:
        if (!email) {
          throw new AppError('Email must be provided.');
        }
        user = await this.agencyRepository.findByEmail(email);
        break;

      default:
        throw new AppError('Invalid user type.');
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
