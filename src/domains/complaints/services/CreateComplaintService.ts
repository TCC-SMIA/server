import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import IStorageProvider from '@shared/providers/StorageProvider/rules/IStorageProvider';
import getLocationInfo from '@shared/utils/getLocationInfo';
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

    if (complaint.anonymous) {
      delete complaint.user;
      delete complaint.user_id;
    }

    return complaint;
  }
}

export default CreateComplaintService;
