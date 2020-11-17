import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../rules/IUsersRepository';
import User from '../infra/typeorm/entities/User';
import { UserTypes } from '../enums/UserEnums';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

@injectable()
class CreateAgencyService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({
    name,
    cnpj,
    email,
    password,
  }: ICreateUserDTO): Promise<User> {
    const checkUserEmailExists = await this.usersRepository.findByEmail(email);

    if (checkUserEmailExists) throw new AppError('Email already exists');

    const checkCnpj = await this.usersRepository.findByCnpj(cnpj as string);

    if (checkCnpj) {
      throw new AppError('CNPJ already exists');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      cnpj,
      email,
      password: hashedPassword,
      type: UserTypes.EnvironmentalAgency,
    });

    return user;
  }
}
export default CreateAgencyService;
