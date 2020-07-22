import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';
import Agency from 'domains/users/infra/typeorm/entities/Agency';

import IHashProvider from 'domains/users/providers/HashProvider/rules/IHashProvider';
import AppError from '@shared/errors/AppError';
import IAgencyRepository from '../rules/IAgencyRepository';

interface IRequest {
  name: string;
  cnpj: string;
  email: string;
  password: string;
}

@injectable()
class CreateAgencyService {
  constructor(
    @inject('AgencyRepository')
    private agencyRepository: IAgencyRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({ name, cnpj, email, password }: IRequest): Promise<Agency> {
    const checkEmailExist = await this.agencyRepository.findByEmail(email);

    if (checkEmailExist) {
      throw new AppError('Email already exists');
    }

    const checkCnpjExists = await this.agencyRepository.findByCnpj(cnpj);

    if (checkCnpjExists) {
      throw new AppError('Cnpj already registered on our database');
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
