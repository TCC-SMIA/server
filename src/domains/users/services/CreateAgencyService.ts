import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import Agency from '@domains/users/infra/typeorm/entities/Agency';

import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
  name: string;
  cnpj: string;
  email: string;
  latitude: number;
  longitude: number;
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

  async execute({
    name,
    cnpj,
    email,
    password,
    latitude,
    longitude,
  }: IRequest): Promise<Agency> {
    const checkEmailExist = await this.agencyRepository.findByEmail(email);

    if (checkEmailExist) {
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
      latitude,
      longitude,
      password: hashedPassword,
    });

    return agency;
  }
}
export default CreateAgencyService;
