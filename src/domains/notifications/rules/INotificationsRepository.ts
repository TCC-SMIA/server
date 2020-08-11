import ICreateNotificationDTO from '../dtos/ICreateNotificationsDTO';

export default interface INotificationsRepository {
  create(data: ICreateNotificationDTO): Promise<Notification>;
}
