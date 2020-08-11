import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IAgencyRepository from '../rules/IAgencyRepository';
import IHashProvider from '../providers/HashProvider/rules/IHashProvider';
import Agency from '../infra/typeorm/entities/Agency';

interface IRequest {
  agencyId: string;
  name: string;
  email: string;
  oldpassword?: string;
  password?: string;
  password_confirmation?: string;
}

@injectable()
class UpdateAgencyService {
  constructor(
    @inject('AgencyRepository')
    private agencyRepository: IAgencyRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({
    agencyId,
    name,
    email,
    oldpassword,
    password,
    password_confirmation,
  }: IRequest): Promise<Agency> {
    const agency = await this.agencyRepository.findById(agencyId);

    if (!agency) {
      throw new AppError('Agency not found');
    }

    const checkEmailExist = await this.agencyRepository.findByEmail(email);

    if (checkEmailExist && checkEmailExist.id !== agencyId) {
      throw new AppError('Email already use');
    }

    agency.name = name;
    agency.email = email;

    if (password && !oldpassword) {
      throw new AppError(
        'To update password is necessary to insert your old password',
      );
    }

    if (password && oldpassword) {
      const passwordMatched = await this.hashProvider.compareHash(
        oldpassword,
        agency.password,
      );

      if (!passwordMatched) {
        throw new AppError('old password is wrong');
      }

      if (password !== password_confirmation) {
        throw new AppError(
          'Password and password_confirmation must be the same',
        );
      }

      agency.password = await this.hashProvider.generateHash(password);
    }

    const updateAgency = await this.agencyRepository.update(agency);

    return updateAgency;
  }
}

export default UpdateAgencyService;
