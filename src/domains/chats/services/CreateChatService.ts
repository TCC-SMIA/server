import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
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

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const contact = await this.usersRepository.findById(contact_id);

    if (!contact) {
      throw new AppError('Contact does not exists.');
    }

    const chat = await this.chatsRepository.create({
      user_id,
      destinatary: contact,
    });

    return chat;
  }
}

export default CreateChatService;
