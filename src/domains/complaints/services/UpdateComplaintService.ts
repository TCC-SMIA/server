import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import { classToClass } from 'class-transformer';
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
}

@injectable()
class UpdateComplaintService {
  constructor(
    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,
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

    complaint.title = title;
    complaint.description = description;
    complaint.latitude = latitude;
    complaint.longitude = longitude;
    complaint.anonymous = anonymous;
    complaint.date = date;

    const updatedComplaint = await this.complaintsRepository.save(complaint);

    if (updatedComplaint.anonymous) {
      delete updatedComplaint.user_id;
      delete updatedComplaint.user;
    }

    return updatedComplaint;
  }
}

export default UpdateComplaintService;
