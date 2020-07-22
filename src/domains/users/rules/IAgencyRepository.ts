import Agency from '../infra/typeorm/entities/Agency';

export default interface IAgencyRepository {
  save(agency: Agency): Promise<Agency>;
}
