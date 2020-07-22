import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import User from 'domains/users/infra/typeorm/entities/User';

import IUsersRepository from 'domains/users/rules/IUsersRepository';
import IHashProvider from 'domains/users/providers/HashProvider/rules/IHashProvider';
import UserTypes from '../enums/UserEnums';
import CreateUserValidator from '../infra/http/validators/CreateUserValidator';

interface IRequest {
  name: string;
  nickname: string;
  email: string;
  password: string;
  type: UserTypes.Admin | UserTypes.Reporter | UserTypes.EnvironmentalAgency;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({
    name,
    nickname,
    email,
    password,
    type,
  }: IRequest): Promise<User> {
    const createUserValidator = new CreateUserValidator(this.usersRepository);

    await createUserValidator.checkUserExists({ nickname, email });

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      nickname,
      email,
      password: hashedPassword,
      type,
    });

    return user;
  }
}

export default CreateUserService;
