import { v4 } from 'uuid';

import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import ICreateNotificationDTO from '@domains/notifications/dtos/ICreateNotificationsDTO';
import Notification from '@domains/notifications/infra/typeorm/entities/Notification';

class FakeNotificationsRepository implements INotificationsRepository {
  private notifications: Notification[] = [];

  public async create({
    user_id,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: v4(), user_id, content });

    this.notifications.push(notification);

    return notification;
  }
}

export default FakeNotificationsRepository;
