import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import Agency from 'domains/users/infra/typeorm/entities/Agency';

import IAgencyRepository from 'domains/users/rules/IAgencyRepository';
import IHashProvider from 'domains/users/providers/HashProvider/rules/IHashProvider';
import AppError from '@shared/errors/AppError';

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
    console.log('Entrou no CreateAgencyService');
    const checkEmailExist = await this.agencyRepository.findByEmail(email);

    console.log(checkEmailExist);

    if (checkEmailExist) {
      throw new AppError('Email already exists');
    }

    // const checkCnpjExists = await this.agencyRepository.findByEmail(email);

    // if (checkCnpjExists) {
    //  throw new AppError('Cnpj already registered on our database');
    // }

    const hashedPassword = await this.hashProvider.generateHash(password);

    console.log(hashedPassword);

    const agency = await this.agencyRepository.create({
      name,
      cnpj,
      email,
      password: hashedPassword,
    });
    return agency;
    console.log(agency);
  }
}
export default CreateAgencyService;
