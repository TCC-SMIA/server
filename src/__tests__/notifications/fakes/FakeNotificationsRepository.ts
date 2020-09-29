import { v4 } from 'uuid';

import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import ICreateNotificationDTO from '@domains/notifications/dtos/ICreateNotificationsDTO';
import Notification from '@domains/notifications/infra/typeorm/entities/Notification';

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async findByUser(user_id: string): Promise<Notification[]> {
    return this.notifications.filter(
      notification => notification.id === user_id,
    );
  }

  public async create(
    notificationData: ICreateNotificationDTO,
  ): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: v4() }, notificationData);

    this.notifications.push(notification);

    return notification;
  }
}

export default FakeNotificationsRepository;
