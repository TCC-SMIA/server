import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IComplaintsRepository from '../rules/IComplaintsRepository';

interface IRequest {
  user_id: string;
  complaint_id: string;
}

@injectable()
class DeleteComplaintService {
  constructor(
    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,
  ) {}

  public async execute({ user_id, complaint_id }: IRequest): Promise<void> {
    const complaint = await this.complaintsRepository.findById(complaint_id);

    if (!complaint) {
      throw new AppError('Complaint not found.');
    }

    if (complaint.user_id !== user_id) {
      throw new AppError(
        'A user can only delete a complaint that have created.',
      );
    }

    await this.complaintsRepository.delete(complaint);
  }
}

export default DeleteComplaintService;