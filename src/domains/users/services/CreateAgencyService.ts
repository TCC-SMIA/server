import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import Agency from '@domains/users/infra/typeorm/entities/Agency';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import AppError from '@shared/errors/AppError';
import { ICreateAgencyDTO } from '../dtos/ICreateAgencyDTO';
import IUsersRepository from '../rules/IUsersRepository';

@injectable()
class CreateAgencyService {
  constructor(
    @inject('AgencyRepository')
    private agencyRepository: IAgencyRepository,

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
  }: ICreateAgencyDTO): Promise<Agency> {
    const [checkUserEmailExists, checkAgencyEmailExists] = await Promise.all([
      this.usersRepository.findByEmail(email),
      this.agencyRepository.findByEmail(email),
    ]);

    if (checkUserEmailExists || checkAgencyEmailExists) {
      throw new AppError('Email already exists');
    }

    const checkCnpj = await this.agencyRepository.findByCnpj(cnpj);

    if (checkCnpj) {
      throw new AppError('CNPJ already exists');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const agency = await this.agencyRepository.create({
      name,
      cnpj,
      email,
      password: hashedPassword,
    });

    return agency;
  }
}
export default CreateAgencyService;
