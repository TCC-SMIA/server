import { inject, injectable } from 'tsyringe';

import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import AppError from '@shared/errors/AppError';

interface IReadNotificationServiceParams {
  user_id: string;
  notification_id: string;
}

@injectable()
class ReadNotificationService {
  constructor(
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({
    user_id,
    notification_id,
  }: IReadNotificationServiceParams): Promise<void> {
    const notification = await this.notificationsRepository.findById(
      notification_id,
    );

    if (!notification) throw new AppError('Notification was not found');

    if (notification.user.id !== user_id)
      throw new AppError('Only the owner can read the notification');

    notification.read = true;

    await this.notificationsRepository.update(notification);
  }
}

export default ReadNotificationService;
