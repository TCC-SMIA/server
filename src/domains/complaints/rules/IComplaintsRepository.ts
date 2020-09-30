import Complaint from '../infra/typeorm/entities/Complaint';

export default interface IComplaintsRepository {
  create(complaintData: Partial<Complaint>): Promise<Complaint>;
  save(complaint: Complaint): Promise<Complaint>;
  delete(complaint: Complaint): Promise<void>;
  findById(complaintId: string): Promise<Complaint | undefined>;
  findAllByUserId(user_id: string): Promise<Complaint[]>;
  findAllComplaints(skip: number, take: number): Promise<Complaint[]>;
  findByCity(skip: number, take: number, city: string): Promise<Complaint[]>;
}
