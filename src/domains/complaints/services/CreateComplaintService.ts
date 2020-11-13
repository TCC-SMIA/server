import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IStorageProvider from '@shared/providers/StorageProvider/rules/IStorageProvider';
import getLocationInfo from '@shared/utils/getLocationInfo';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import AppError from '@shared/errors/AppError';
import CreateNotificationService from '@domains/notifications/services/CreateNotificationService';
import * as socket from '@shared/websocket/websocket';
import SocketChannels from '@shared/websocket/socket-channels';
import Complaint from '../infra/typeorm/entities/Complaint';
import IComplaintsRepository from '../rules/IComplaintsRepository';
import { ComplaintTypeEnum } from '../enums/ComplaintTypeEnum';
import { ComplaintStatusEnum } from '../enums/ComplaintStatusEnum';

interface IRequest {
  user_id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  anonymous: boolean;
  date: Date;
  type: ComplaintTypeEnum;
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
    type,
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
      type,
      status: ComplaintStatusEnum.New,
    });

    await this.createNotificationService.execute({
      user_id: complaint.user_id,
      content: `Sua denuncia foi criada com sucesso!`,
    });

    if (complaint.anonymous) {
      delete complaint.user;
      delete complaint.user_id;
    }

    const complaints = await this.complaintsRepository.findAllComplaints(0, 10);

    const sendTo = socket.findAllConnections();
    socket.sendMessage(
      sendTo,
      SocketChannels.ComplaintsFeedChannel,
      complaints,
    );

    return classToClass(complaint);
  }
}

export default CreateComplaintService;
