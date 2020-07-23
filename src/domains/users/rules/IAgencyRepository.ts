import Agency from '../infra/typeorm/entities/Agency';
import ICreateAgencyDTO from '../dtos/ICreateAgencyDTO';

export default interface IAgencyRepository {
  save(agency: ICreateAgencyDTO): Promise<Agency>;
  findByEmail(email: string): Promise<Agency>;
}
