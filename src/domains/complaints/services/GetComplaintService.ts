import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IComplaintsRepository from '../rules/IComplaintsRepository';
import Complaint from '../infra/typeorm/entities/Complaint';

interface IRequest {
  complaint_id: string;
}

@injectable()
class GetComplaintService {
  constructor(
    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,
  ) {}

  public async execute({ complaint_id }: IRequest): Promise<Complaint> {
    const complaint = await this.complaintsRepository.findById(complaint_id);

    if (!complaint) throw new AppError('Complaint was not found');

    return complaint;
  }
}

export default GetComplaintService;
