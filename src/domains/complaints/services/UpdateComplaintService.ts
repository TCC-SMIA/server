import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';
import CreateNotificationService from '@domains/notifications/services/CreateNotificationService';
import Complaint from '../infra/typeorm/entities/Complaint';
import IComplaintsRepository from '../rules/IComplaintsRepository';

interface IRequest {
  user_id: string;
  complaint_id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  anonymous: boolean;
  date: Date;
  status: string;
  type: string;
}

@injectable()
class UpdateComplaintService {
  constructor(
    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,

    @inject('CreateNotificationService')
    private createNotificationService: CreateNotificationService,
  ) {}

  public async execute({
    user_id,
    complaint_id,
    title,
    description,
    latitude,
    longitude,
    anonymous,
    date,
    status,
    type,
  }: IRequest): Promise<Complaint> {
    const complaint = await this.complaintsRepository.findById(complaint_id);

    if (!complaint) {
      throw new AppError('Complaint not found.');
    }

    if (complaint.user_id !== user_id) {
      throw new AppError(
        'A user can only update complaints that have created.',
      );
    }

    Object.assign(complaint, {
      title,
      description,
      latitude,
      longitude,
      anonymous,
      date,
      status,
      type,
    } as Omit<Partial<Complaint>, 'id'>);

    await this.complaintsRepository.save(complaint);

    await this.createNotificationService.execute({
      user_id: complaint.user_id,
      content: `Sua denuncia foi atualizada com sucesso!`,
    });

    if (complaint.anonymous) {
      delete complaint.user;
      delete complaint.user_id;
    }

    return classToClass(complaint);
  }
}

export default UpdateComplaintService;
