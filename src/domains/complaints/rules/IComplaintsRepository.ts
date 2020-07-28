import Complaint from '../infra/typeorm/entities/Complaint';
import ICreateComplaintDTO from '../dtos/ICreateComplaintDTO';

export default interface IComplaintsRepository {
  create(complaintData: ICreateComplaintDTO): Promise<Complaint>;
  save(complaint: Complaint): Promise<Complaint>;
  findById(complaintId: string): Promise<Complaint | undefined>;
  findAllByUserId(user_id: string): Promise<Complaint[] | undefined>;
}
