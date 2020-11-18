import { v4 } from 'uuid';

import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import ICreateNotificationDTO from '@domains/notifications/dtos/ICreateNotificationsDTO';
import Notification from '@domains/notifications/infra/typeorm/entities/Notification';

class FakeNotificationsRepository implements INotificationsRepository {
  public async findById(
    notification_id: string,
  ): Promise<Notification | undefined> {
    return this.notifications.find(
      notification => notification.id === notification_id,
    );
  }

  public async update(notification: Notification): Promise<Notification> {
    const notificationIndex = this.notifications.findIndex(
      storedNotification => storedNotification.id === notification.id,
    );

    this.notifications[notificationIndex] = notification as Notification;

    return this.notifications[notificationIndex];
  }

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

  public async delete(notification_id: string): Promise<void> {
    const notificationIndex = this.notifications.findIndex(
      notification => notification.id === notification_id,
    );

    this.notifications.splice(notificationIndex, 1);
  }
}

export default FakeNotificationsRepository;
