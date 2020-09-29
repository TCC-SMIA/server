import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import INotificationsRepository from '../rules/INotificationsRepository';
import Notification from '../infra/typeorm/entities/Notification';

interface IGetNotificationsParams {
  user_id: string;
}

@injectable()
class GetNotificationsByUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({
    user_id,
  }: IGetNotificationsParams): Promise<Notification[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User was not found');

    const notifications = await this.notificationsRepository.findByUser(
      user.id,
    );

    return notifications;
  }
}

export default GetNotificationsByUserService;
