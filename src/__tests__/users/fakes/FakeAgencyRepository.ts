import Agency from '@domains/users/infra/typeorm/entities/Agency';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';

class FakeAgencyRepository implements IAgencyRepository {
  private agencies: Agency[] = [];

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
