import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import User from '@domains/users/infra/typeorm/entities/User';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import { ComplaintStatusEnum } from '@domains/complaints/enums/ComplaintStatusEnum';

interface IRequest {
  user_id: string;
}

interface IResume {
  user: User;
  complaints_reported: number;
  complaints_in_progress: number;
  complaints_resolved: number;
}

@injectable()
class GetUserResumeService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,
  ) {}

  async execute({ user_id }: IRequest): Promise<IResume> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User was not found');

    const complaints = await this.complaintsRepository.findAllByUserId(user_id);

    const complaints_reported = complaints.length;

    const complaints_in_progress = complaints.filter(
      complaint => complaint.status === ComplaintStatusEnum.InProgress,
    ).length;

    const complaints_resolved = complaints.filter(
      complaint => complaint.status === ComplaintStatusEnum.Resolved,
    ).length;

    return {
      user: classToClass(user),
      complaints_reported,
      complaints_in_progress,
      complaints_resolved,
    } as IResume;
  }
}

export default GetUserResumeService;
