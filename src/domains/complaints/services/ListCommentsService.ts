import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IComplaintsRepository from '../rules/IComplaintsRepository';
import Comment from '../infra/typeorm/entities/Comment';
import ICommentsRepository from '../rules/ICommentsRepository';

interface IRequest {
  complaint_id: string;
}

@injectable()
class ListCommentsService {
  constructor(
    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,

    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,
  ) {}

  public async execute({ complaint_id }: IRequest): Promise<Comment[]> {
    const complaint = await this.complaintsRepository.findById(complaint_id);

    if (!complaint) {
      throw new AppError('Complaint not found');
    }

    const listComments = await this.commentsRepository.findByComplaintId(
      complaint_id,
    );

    return listComments;
  }
}

export default ListCommentsService;
