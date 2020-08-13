import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import IStorageProvider from '@shared/providers/StorageProvider/rules/IStorageProvider';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import AppError from '@shared/errors/AppError';
import Complaint from '../infra/typeorm/entities/Complaint';
import IComplaintsRepository from '../rules/IComplaintsRepository';

interface IRequest {
  user_id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  anonymous: boolean;
  date: Date;
  imageFilename?: string;
}

@injectable()
class CreateComplaintService {
  constructor(
    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('AgencyRepository')
    private agencyRepository: IAgencyRepository,
  ) {}

  public async execute({
    user_id,
    title,
    description,
    latitude,
    longitude,
    anonymous,
    date,
    imageFilename,
  }: IRequest): Promise<Complaint> {
    let filename = '';

    const checkIfIsAgency = await this.agencyRepository.findById(user_id);

    if (checkIfIsAgency) {
      throw new AppError('This kind of user can not create a complaint');
    }

    if (imageFilename) {
      filename = await this.storageProvider.saveFile(imageFilename);
    }

    const complaint = await this.complaintsRepository.create({
      user_id,
      title,
      description,
      latitude,
      longitude,
      anonymous,
      date,
      image: filename,
    });

    if (complaint.anonymous) {
      delete complaint.user;
      delete complaint.user_id;
    }

    return complaint;
  }
}

export default CreateComplaintService;
