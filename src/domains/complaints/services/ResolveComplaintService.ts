import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';
import IComplaintsRepository from '../rules/IComplaintsRepository';
import Complaint from '../infra/typeorm/entities/Complaint';
import { ComplaintStatusEnum } from '../enums/ComplaintStatusEnum';

interface IRequest {
  complaint_id: string;
  user_id: string;
}

@injectable()
class ResolveComplaintService {
  constructor(
    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,
  ) {}

  public async execute({
    complaint_id,
    user_id,
  }: IRequest): Promise<Complaint> {
    const complaint = await this.complaintsRepository.findById(complaint_id);

    if (!complaint) throw new AppError('Complaint does not exist');

    if (complaint.user.id !== user_id)
      throw new AppError('Complaints can only be resolved by its owner');

    complaint.status = ComplaintStatusEnum.Resolved;

    const savedComplaint = await this.complaintsRepository.save(complaint);

    return classToClass(savedComplaint);
  }
}

export default ResolveComplaintService;
