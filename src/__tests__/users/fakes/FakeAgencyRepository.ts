import Agency from '@domains/users/infra/typeorm/entities/Agency';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import { uuid } from 'uuidv4';

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

  public async create(agencyData: Agency): Promise<Agency> {
    const agency = new Agency();

    Object.assign(agency, { id: uuid() }, agencyData);

    this.agencies.push(agency);

    return agency;
  }

  public async save(agency: Agency): Promise<Agency> {
    this.agencies.push(agency);

    return agency;
  }

  public async findByEmail(email: string): Promise<Agency | undefined> {
    const storedAgency = this.agencies.find(agenc => agenc.email === email);

    return storedAgency;
  }
}

export default FakeAgencyRepository;
