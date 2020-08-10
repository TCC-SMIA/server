import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import ICreateNotificationDTO from '@domains/notifications/dtos/ICreateNotificationsDTO';
import { MongoRepository, getMongoRepository } from 'typeorm';
import Notification from '../schemas/Notification';

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  public async create({
    user_id,
    content,
  }: ICreateNotificationDTO): Promise<Notification> {
    const newNotification = this.ormRepository.create({
      content,
      user_id,
    });

    await this.ormRepository.save(newNotification);

    return newNotification;
  }
}

export default NotificationsRepository;
