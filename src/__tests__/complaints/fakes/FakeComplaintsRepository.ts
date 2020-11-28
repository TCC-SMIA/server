import { v4 } from 'uuid';

import Complaint from '@domains/complaints/infra/typeorm/entities/Complaint';
import IComplaintsRepository, {
  IComplaintsFilters,
} from '@domains/complaints/rules/IComplaintsRepository';

class FakeComplaintsRepository implements IComplaintsRepository {
  private complaints: Complaint[] = [];

  public async findAllByUserId(user_id: string): Promise<Complaint[]> {
    const userComplaints = this.complaints.filter(complaint => {
      return complaint.user_id === user_id;
    });

    return userComplaints;
  }

  public async findByFilters(
    skip: number,
    take: number,
    filters: IComplaintsFilters,
  ): Promise<Complaint[]> {
    let userComplaints = this.complaints;

    if (filters.state)
      userComplaints = userComplaints.filter(
        stateFilterComplaint => stateFilterComplaint.state === filters.state,
      );

    if (filters.city)
      userComplaints = userComplaints.filter(
        cityFilterComplaint => cityFilterComplaint.city === filters.city,
      );

    if (filters.type)
      userComplaints = userComplaints.filter(
        typeFilterComplaint => typeFilterComplaint.type === filters.type,
      );

    if (filters.status)
      userComplaints = userComplaints.filter(
        statusFilterComplaint =>
          statusFilterComplaint.status === filters.status,
      );

    return userComplaints.slice(skip, take);
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

  public async delete(complaint: Complaint): Promise<void> {
    const complaintIndex = this.complaints.findIndex(
      complaintItem => complaintItem.id === complaint.id,
    );

    this.complaints.slice(complaintIndex);
  }

  public async findByCity(
    skip: number,
    take: number,
    city: string,
    state: string,
  ): Promise<Complaint[]> {
    let complaintsFiltered: Complaint[];

    complaintsFiltered = this.complaints.filter(
      complaint => complaint.city === city && complaint.state === state,
    );

    complaintsFiltered = complaintsFiltered.slice(skip, take);

    return complaintsFiltered;
  }

  public async findByState(
    skip: number,
    take: number,
    state: string,
  ): Promise<Complaint[]> {
    let complaintsFiltered: Complaint[];

    complaintsFiltered = this.complaints.filter(
      complaint => complaint.state === state,
    );

    complaintsFiltered = complaintsFiltered.slice(skip, take);

    return complaintsFiltered;
  }
}

export default FakeComplaintsRepository;
