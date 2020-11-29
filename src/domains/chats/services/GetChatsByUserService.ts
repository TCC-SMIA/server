import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import { classToClass } from 'class-transformer';
import IChatsRepository from '../rules/IChatsRepository';
import Chat from '../infra/typeorm/entities/Chat';

interface IRequest {
  user_id: string;
}

@injectable()
class GetChatsByUserService {
  constructor(
    @inject('ChatsRepository')
    private chatsRepository: IChatsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<Chat[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const chats = await this.chatsRepository.findAllByUser(user_id);

    const orderedChats = chats.sort(
      (chatA: Chat, chatB: Chat) =>
        new Date(chatB.updated_at).getTime() -
        new Date(chatA.updated_at).getTime(),
    );

    return classToClass(orderedChats);
  }
}

export default GetChatsByUserService;
