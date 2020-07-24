import Agency from '@domains/users/infra/typeorm/entities/Agency';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import IAgencyDTO from '@domains/users/dtos/IAgencyDTO';

class FakeAgencyRepository implements IAgencyRepository {
  private agencies: Agency[] = [];

  public async create(data: IAgencyDTO): Promise<Agency> {
    const agency = new Agency();
    const formattedAgency = Object.assign(agency, data);

    formattedAgency.id = String(Math.random());

    this.agencies.push(formattedAgency);

    return formattedAgency;
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
