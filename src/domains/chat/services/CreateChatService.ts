import { inject, injectable } from 'tsyringe';

import User from '@domains/users/infra/typeorm/entities/User';
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
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const contact = await this.usersRepository.findById(contact_id);

    if (!contact) {
      throw new AppError('Contact does not exists.');
    }

    const users = [user, contact];

    const chat = await this.chatsRepository.create({ users });

    return chat;
  }
}

export default CreateChatService;
