import Complaint from '../infra/typeorm/entities/Complaint';

export interface IComplaintsFilters {
  state?: string;
  city?: string;
  type?: string;
  status?: string;
}
export default interface IComplaintsRepository {
  create(complaintData: Partial<Complaint>): Promise<Complaint>;
  save(complaint: Complaint): Promise<Complaint>;
  delete(complaint: Complaint): Promise<void>;
  findById(complaintId: string): Promise<Complaint | undefined>;
  findAllByUserId(user_id: string): Promise<Complaint[]>;
  findAllComplaints(skip: number, take: number): Promise<Complaint[]>;
  findByCity(
    skip: number,
    take: number,
    city: string,
    state: string,
  ): Promise<Complaint[]>;
  findByState(skip: number, take: number, state: string): Promise<Complaint[]>;
  findByFilters(
    skip: number,
    take: number,
    filters: IComplaintsFilters,
  ): Promise<Complaint[]>;
}
