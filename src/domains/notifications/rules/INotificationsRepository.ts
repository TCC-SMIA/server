import ICreateNotificationDTO from '@domains/notifications/dtos/ICreateNotificationsDTO';
import Notification from '@domains/notifications/infra/typeorm/entities/Notification';

export default interface INotificationsRepository {
  create(notificationData: ICreateNotificationDTO): Promise<Notification>;
  findByUser(user_id: string): Promise<Notification[]>;
  findById(notification_id: string): Promise<Notification | undefined>;
  update(notification: Notification): Promise<Notification>;
}
