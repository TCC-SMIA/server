import { Repository, getRepository } from 'typeorm';

import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import Complaint from '../entities/Complaint';

class ComplaintsRepository implements IComplaintsRepository {
  private complaintsRepository: Repository<Complaint>;

  constructor() {
    this.complaintsRepository = getRepository(Complaint);
  }

  public async create(data: Partial<Complaint>): Promise<Complaint> {
    const complaint = this.complaintsRepository.create(data);

    const createdComplaint = await this.complaintsRepository.save(complaint);

    return createdComplaint;
  }
}

export default ComplaintsRepository;
