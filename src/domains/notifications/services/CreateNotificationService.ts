import { inject, injectable } from 'tsyringe';
import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';

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
  }
}

export default CreateNotificationService;
