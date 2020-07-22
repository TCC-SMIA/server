import 'reflect-metadata';
import { sign } from 'jsonwebtoken';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import authConfig from '@config/authConfig';
import CreateSessionValidator from '@domains/users/infra/http/validators/CreateSessionValidator';
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
    const createSessionValidator = new CreateSessionValidator(
      this.usersRepository,
      this.hashProvider,
    );

    const user = await createSessionValidator.checkUserCredentials({
      email,
      nickname,
      password,
    });

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
