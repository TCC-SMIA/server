import Complaint from '../infra/typeorm/entities/Complaint';

export default interface IComplaintsRepository {
  create(data: Partial<Complaint>): Promise<Complaint>;
}
