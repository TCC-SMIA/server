import { Repository, getRepository } from 'typeorm';

import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import Agency from '../entities/Agency';

class AgencyRepository implements IAgencyRepository {
  private agencyRepository: Repository<Agency>;

  constructor() {
    this.agencyRepository = getRepository(Agency);
  }

  public async save(agencyData: Agency): Promise<Agency> {
    const agency = this.agencyRepository.create(agencyData);

    const storedAgency = await this.agencyRepository.save(agency);

    return storedAgency;
  }

  public async findByEmail(email: string): Promise<Agency | undefined> {
    const agency = await this.agencyRepository.findOne({ where: { email } });

    return agency;
  }
}

export default AgencyRepository;
