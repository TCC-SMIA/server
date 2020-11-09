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
import { UserTypes } from '../enums/UserEnums';
import IAgencyRepository from '../rules/IAgencyRepository';
import Agency from '../infra/typeorm/entities/Agency';

interface IRequest {
  login: string;
  password: string;
}

interface IResponse {
  user: User | Agency;
  token: string;
  user_type: number;
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

  public async execute({ login, password }: IRequest): Promise<IResponse> {
    let user: User | Agency | undefined;
    let user_type = 0;

    const validEmail = Validator.isEmail(login);

    if (!validEmail) {
      user = await this.usersRepository.findByNickname(login);
      user_type = UserTypes.Reporter;
    }

    if (validEmail) {
      user = await this.usersRepository.findByEmail(login);
      user_type = UserTypes.Reporter;
    }

    if (!user) {
      user = await this.agencyRepository.findByEmail(login);
      user_type = UserTypes.EnvironmentalAgency;
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

    return { user, token, user_type };
  }
}

export default AuthenticateUserService;
