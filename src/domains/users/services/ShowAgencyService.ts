import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import AppError from '@shared/errors/AppError';
import Agency from '../infra/typeorm/entities/Agency';

interface IRequest {
  agencyId: string;
}

@injectable()
class ShowAgencyService {
  constructor(
    @inject('AgencyRepository')
    private agencyRepository: IAgencyRepository,
  ) {}

  async execute({ agencyId }: IRequest): Promise<Agency> {
    const agency = await this.agencyRepository.findById(agencyId);

    if (!agency) {
      throw new AppError('Agency not found');
    }

    return classToClass(agency);
  }
}

export default ShowAgencyService;
