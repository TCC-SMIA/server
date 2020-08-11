import { v4 } from 'uuid';

import Agency from '@domains/users/infra/typeorm/entities/Agency';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';

class FakeAgencyRepository implements IAgencyRepository {
  public async findByCnpj(cnpj: string): Promise<Agency | undefined> {
    const storedAgency = this.agencies.find(agenc => agenc.cnpj === cnpj);

    return storedAgency;
  }

  public async findById(id: string): Promise<Agency | undefined> {
    const storedAgency = this.agencies.find(agenc => agenc.id === id);

    return storedAgency;
  }

  private agencies: Agency[] = [];

  public async create(agencyData: Partial<Agency>): Promise<Agency> {
    const agency = new Agency();

    Object.assign(agency, { id: v4() }, agencyData);

    this.agencies.push(agency);

    return agency;
  }

  public async update(agency: Agency): Promise<Agency> {
    const agencyIndex = this.agencies.findIndex(
      findAgency => findAgency.id === agency.id,
    );

    this.agencies[agencyIndex] = agency;

    return this.agencies[agencyIndex];
  }

  public async findByEmail(email: string): Promise<Agency | undefined> {
    const storedAgency = this.agencies.find(agenc => agenc.email === email);

    return storedAgency;
  }
}

export default FakeAgencyRepository;
