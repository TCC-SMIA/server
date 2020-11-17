import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import SocketChannels from '@shared/websocket/socket-channels';
import * as socket from '@shared/websocket/websocket';
import IChatsRepository from '../rules/IChatsRepository';
import Chat from '../infra/typeorm/entities/Chat';

interface IRequest {
  user_id: string;
  contact_id: string;
}

@injectable()
class CreateChatService {
  constructor(
    @inject('ChatsRepository')
    private chatsRepository: IChatsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, contact_id }: IRequest): Promise<Chat> {
    if (user_id === contact_id)
      throw new AppError('You can not create a chat with yourself');

    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User does not exists.');

    const contact = await this.usersRepository.findById(contact_id);

    if (!contact) throw new AppError('Contact does not exists.');

    const doesExist = await this.chatsRepository.doesExist(user_id, contact);

    if (doesExist) return doesExist;

    const chat = await this.chatsRepository.create({
      user_id,
      destinatary: contact,
    });

    const chats = await this.chatsRepository.findAllByUser(contact_id);

    const sendTo = socket.findConnections(contact.id);

    socket.sendMessage(sendTo, SocketChannels.ChatChannel, chats);

    return classToClass(chat);
  }
}

export default CreateChatService;
