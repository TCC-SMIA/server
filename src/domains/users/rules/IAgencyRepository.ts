import Agency from '../infra/typeorm/entities/Agency';
import IAgencyDTO from '../dtos/IAgencyDTO';

export default interface IAgencyRepository {
  save(agency: IAgencyDTO): Promise<Agency>;
  findByEmail(email: string): Promise<Agency | undefined>;
}
