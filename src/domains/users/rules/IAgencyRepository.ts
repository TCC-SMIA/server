import Agency from '../infra/typeorm/entities/Agency';

export default interface IAgencyRepository {
  create(agencyData: Partial<Agency>): Promise<Agency>;
  update(agency: Agency): Promise<Agency>;
  findByEmail(email: string): Promise<Agency | undefined>;
  findByCnpj(cnpj: string): Promise<Agency | undefined>;
  findById(id: string): Promise<Agency | undefined>;
}
