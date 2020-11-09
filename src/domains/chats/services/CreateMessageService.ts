import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import IChatsRepository from '../rules/IChatsRepository';
import Message from '../infra/typeorm/entities/Message';
import IMessagesRepository from '../rules/IMessagesRepository';

interface IRequest {
  user_id: string;
  chat_id: string;
  content: string;
}

@injectable()
class CreateMessageService {
  constructor(
    @inject('ChatsRepository')
    private chatsRepository: IChatsRepository,

    @inject('MessagesRepository')
    private messagesRepository: IMessagesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,
  ) {}

  public async execute({
    user_id,
    chat_id,
    content,
  }: IRequest): Promise<Message> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    const chat = await this.chatsRepository.findById(chat_id);

    if (!chat) {
      throw new AppError('Chat was not found.');
    }

    const newMessage = await this.messagesRepository.create({
      content,
      user,
      user_id,
      chat,
    });

    await this.notificationsRepository.create({
      user_id: chat.destinatary.id,
      content: `Você tem uma nova mensagem de ${user.name}.`,
    });

    return newMessage;
  }
}

export default CreateMessageService;
