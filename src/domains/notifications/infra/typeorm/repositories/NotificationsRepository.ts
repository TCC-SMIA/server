import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import ICreateNotificationDTO from '@domains/notifications/dtos/ICreateNotificationsDTO';
import { Repository, getRepository } from 'typeorm';
import Notification from '../entities/Notification';

class NotificationsRepository implements INotificationsRepository {
  private ormRepository: Repository<Notification>;

  constructor() {
    this.ormRepository = getRepository(Notification);
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
