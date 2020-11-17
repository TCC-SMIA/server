import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/StorageProvider/rules/IStorageProvider';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}
interface IResponse {
  user: User;
  user_type: number;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    avatarFilename,
  }: IRequest): Promise<IResponse> {
    const user_type = 0;

    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User not found');

    if (user.avatar) await this.storageProvider.deleteFile(user.avatar);

    const filename = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = filename;

    await this.usersRepository.update(user);

    return { user: classToClass(user), user_type };
  }
}

export default UpdateUserAvatarService;
