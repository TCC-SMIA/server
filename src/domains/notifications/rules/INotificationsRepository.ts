import Notification from '@domains/notifications/infra/typeorm/entities/Notification';
import ICreateNotificationDTO from '@domains/notifications/dtos/ICreateNotificationsDTO';

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>;
}
