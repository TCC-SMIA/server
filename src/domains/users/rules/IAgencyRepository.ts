import Agency from '../infra/typeorm/entities/Agency';
import ICreateAgencyDTO from '../dtos/ICreateAgencyDTO';

export default interface IAgencyRepository {
  create(agencyData: ICreateAgencyDTO): Promise<Agency>;
  save(agency: Agency): Promise<Agency>;
  findByEmail(email: string): Promise<Agency | undefined>;
}
