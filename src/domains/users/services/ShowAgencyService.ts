import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

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
    const checkAgencyExists = await this.agencyRepository.findById(agencyId);

    if (!checkAgencyExists) {
      throw new AppError('Agency not found');
    }

    return checkAgencyExists;
  }
}

export default ShowAgencyService;
