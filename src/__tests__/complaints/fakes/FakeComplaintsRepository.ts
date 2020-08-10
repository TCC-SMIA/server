import { v4 } from 'uuid';

import Complaint from '@domains/complaints/infra/typeorm/entities/Complaint';
import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';

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

  public async create(complaintData: Partial<Complaint>): Promise<Complaint> {
    const complaint = new Complaint();

    Object.assign(complaint, { id: v4() }, complaintData);

    this.complaints.push(complaint);

    return complaint;
  }

  public async save(complaint: Complaint): Promise<Complaint> {
    this.complaints.push(complaint);

    return complaint;
  }

  public async findAllComplaints(skip = 0, take = 10): Promise<Complaint[]> {
    const findComplaints = this.complaints.slice(skip, take);

    return findComplaints;
  }
}

export default FakeComplaintsRepository;
