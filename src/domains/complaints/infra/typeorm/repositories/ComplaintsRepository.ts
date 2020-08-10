import { Repository, getRepository } from 'typeorm';

import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import Complaint from '../entities/Complaint';

class ComplaintsRepository implements IComplaintsRepository {
  private complaintsRepository: Repository<Complaint>;

  constructor() {
    this.complaintsRepository = getRepository(Complaint);
  }

  public async create(complaintData: Partial<Complaint>): Promise<Complaint> {
    const complaint = this.complaintsRepository.create(complaintData);

    const createdComplaint = await this.complaintsRepository.save(complaint);

    return createdComplaint;
  }

  public async save(complaint: Complaint): Promise<Complaint> {
    return this.complaintsRepository.save(complaint);
  }

  public async findById(complaintId: string): Promise<Complaint | undefined> {
    const complaint = await this.complaintsRepository.findOne({
      where: { id: complaintId },
      relations: ['user'],
    });

    return complaint;
  }

  public async findAllByUserId(user_id: string): Promise<Complaint[]> {
    const complaints = await this.complaintsRepository.find({
      where: { user_id },
      relations: ['user'],
    });

    return complaints;
  }

  public async findAllComplaints(
    skip: number,
    take: number,
  ): Promise<Complaint[]> {
    const complaints = await this.complaintsRepository.find({
      skip,
      take,
      order: {
        created_at: 'DESC',
      },
    });

    return complaints;
  }

  public async delete(complaint: Complaint): Promise<void> {
    await this.complaintsRepository.remove(complaint);
  }
}

export default ComplaintsRepository;
