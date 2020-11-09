import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IStorageProvider from '@shared/providers/StorageProvider/rules/IStorageProvider';
import getLocationInfo from '@shared/utils/getLocationInfo';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import AppError from '@shared/errors/AppError';
import CreateNotificationService from '@domains/notifications/services/CreateNotificationService';
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
  imageFilename?: string | undefined;
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

    @inject('CreateNotificationService')
    private createNotificationService: CreateNotificationService,
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
    const checkIfIsAgency = await this.agencyRepository.findById(user_id);

    if (checkIfIsAgency) {
      throw new AppError('This kind of user can not create a complaint');
    }

    let filename;

    if (imageFilename) {
      filename = await this.storageProvider.saveFile(imageFilename);
    }

    const { city, state } = await getLocationInfo({ latitude, longitude });

    const complaint = await this.complaintsRepository.create({
      user_id,
      title,
      description,
      latitude,
      longitude,
      city,
      state,
      anonymous,
      date,
      image: filename,
    });

    await this.createNotificationService.execute({
      user_id: complaint.user_id,
      content: `Sua denuncia foi criada com sucesso!`,
    });

    if (complaint.anonymous) {
      delete complaint.user;
      delete complaint.user_id;
    }

    return classToClass(complaint);
  }
}

export default CreateComplaintService;
