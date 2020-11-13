import { inject, injectable } from 'tsyringe';

import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import { findConnections, sendMessage } from '@shared/websocket/websocket';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@domains/users/rules/IUsersRepository';

interface CreateCommentRequest {
  user_id: string;
  content: string;
}

@injectable()
class CreateNotificationService {
  constructor(
    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({
    user_id,
    content,
  }: CreateCommentRequest): Promise<void> {
    await this.notificationsRepository.create({
      user_id,
      content,
    });

    const notifications = await this.notificationsRepository.findByUser(
      user_id,
    );

    const sendTo = findConnections(user_id);
    sendMessage(sendTo, 'new-notification', notifications);
  }
}

export default CreateNotificationService;
