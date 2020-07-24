import { Repository, getRepository } from 'typeorm';

import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import Agency from '@domains/users/infra/typeorm/entities/Agency';
import ICreateAgencyDTO from '@domains/users/dtos/ICreateAgencyDTO';

class AgencyRepository implements IAgencyRepository {
  private agencyRepository: Repository<Agency>;

  constructor() {
    this.agencyRepository = getRepository(Agency);
  }

  public async create(agencyData: ICreateAgencyDTO): Promise<Agency> {
    const agency = this.agencyRepository.create(agencyData);

    await this.agencyRepository.save(agency);

    return agency;
  }

  public async save(agency: Agency): Promise<Agency> {
    return this.agencyRepository.save(agency);
  }

  public async findByEmail(email: string): Promise<Agency | undefined> {
    const agency = await this.agencyRepository.findOne({ where: { email } });

    // if (!agency) {
    // throw new AppError('Email already exists');
    // }

    return agency;
  }
}

export default AgencyRepository;
