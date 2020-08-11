import ICreateNotificationDTO from '@domains/notifications/dtos/ICreateNotificationsDTO';
import Notification from '@domains/notifications/infra/typeorm/entities/Notification';

export default interface INotificationsRepository {
  create(notificationData: ICreateNotificationDTO): Promise<Notification>;
}
