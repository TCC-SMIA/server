import Agency from '@domains/users/infra/typeorm/entities/Agency';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import AppError from '@shared/errors/AppError';

class FakeAgencyRepository implements IAgencyRepository {
  private agencies: Agency[] = [];

  public async save(agency: Agency): Promise<Agency> {
    this.agencies.push(agency);

    return agency;
  }

  public async findByEmail(email: string): Promise<Agency> {
    const storedAgency = this.agencies.find(agenc => agenc.email === email);
    if (!storedAgency) {
      throw new AppError('');
    }
    return storedAgency;
  }
}

export default FakeAgencyRepository;
