import { inject, injectable } from 'tsyringe';

import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import * as socket from '@shared/websocket/websocket';
import SocketChannels from '@shared/websocket/socket-channels';

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

    const sendTo = socket.findConnections(user_id);
    socket.sendMessage(
      sendTo,
      SocketChannels.NotificationsChannel,
      notifications,
    );
  }
}

export default CreateNotificationService;
