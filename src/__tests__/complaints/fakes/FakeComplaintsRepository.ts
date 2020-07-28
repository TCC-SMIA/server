import { uuid } from 'uuidv4';

import Complaint from '@domains/complaints/infra/typeorm/entities/Complaint';
import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import ICreateComplaintDTO from '@domains/complaints/dtos/ICreateComplaintDTO';

class FakeComplaintsRepository implements IComplaintsRepository {
  private complaints: Complaint[] = [];

  public async findAllByUserId(user_id: string): Promise<Complaint[]> {
    const userComplaints = this.complaints.filter(complaint => {
      return complaint.user_id === user_id;
    });

    return userComplaints;
  }

  public async findById(complaintId: string): Promise<Complaint | undefined> {
    const complaintExists = this.complaints.find(
      complaint => complaint.id === complaintId,
    );

    return complaintExists;
  }

  public async create(complaintData: ICreateComplaintDTO): Promise<Complaint> {
    const complaint = new Complaint();

    Object.assign(complaint, { id: uuid() }, complaintData);

    this.complaints.push(complaint);

    return complaint;
  }

  public async save(complaint: Complaint): Promise<Complaint> {
    this.complaints.push(complaint);

    return complaint;
  }
}

export default FakeComplaintsRepository;
