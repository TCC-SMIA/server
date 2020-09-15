import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/StorageProvider/rules/IStorageProvider';
import User from '../infra/typeorm/entities/User';
import IAgencyRepository from '../rules/IAgencyRepository';
import Agency from '../infra/typeorm/entities/Agency';
import { UserTypes } from '../enums/UserEnums';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}
interface IResponse {
  user: User | Agency;
  user_type: number;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AgencyRepository')
    private agencyRepository: IAgencyRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    avatarFilename,
  }: IRequest): Promise<IResponse> {
    let user: User | Agency | undefined;
    let user_type = 0;

    user = await this.usersRepository.findById(user_id);

    if (!user) {
      user = await this.agencyRepository.findById(user_id);
      if (!user) {
        throw new AppError('User not found');
      } else {
        user_type = UserTypes.EnvironmentalAgency;
      }
    } else {
      user_type = UserTypes.Reporter;
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const filename = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = filename;

    if (user_type === UserTypes.Reporter) {
      await this.usersRepository.update(user as User);
    }

    if (user_type === UserTypes.EnvironmentalAgency) {
      await this.agencyRepository.update(user as Agency);
    }

    return { user, user_type };
  }
}

export default UpdateUserAvatarService;
