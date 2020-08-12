import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/StorageProvider/rules/IStorageProvider';
import Complaint from '@domains/complaints/infra/typeorm/entities/Complaint';
import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';

interface IRequest {
  user_id: string;
  complaint_id: string;
  imageFilename: string;
}

@injectable()
class UpdateImageComplaintService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,
  ) {}

  public async execute({
    user_id,
    complaint_id,
    imageFilename,
  }: IRequest): Promise<Complaint> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const complaint = await this.complaintsRepository.findById(complaint_id);

    if (!complaint) {
      throw new AppError('Complaint not found');
    }

    if (complaint.user_id !== user.id) {
      throw new AppError(
        'Update complaint image is only for the user who have created',
      );
    }

    if (complaint.image) {
      await this.storageProvider.deleteFile(complaint.image);
    }

    const filename = await this.storageProvider.saveFile(imageFilename);

    complaint.image = filename;

    await this.complaintsRepository.save(complaint);

    return complaint;
  }
}

export default UpdateImageComplaintService;
