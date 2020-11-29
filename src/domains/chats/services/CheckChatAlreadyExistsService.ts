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
class CheckChatAlreadyExistsService {
  constructor(
    @inject('ChatsRepository')
    private chatsRepository: IChatsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    contact_id,
  }: IRequest): Promise<Chat | undefined> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User does not exists.');

    const contact = await this.usersRepository.findById(contact_id);

    if (!contact) throw new AppError('Contact does not exists.');

    const [userChat, contactChat] = await Promise.all([
      this.chatsRepository.doesExist(user_id, contact),
      this.chatsRepository.doesExist(contact.id, user),
    ]);

    if (userChat) {
      userChat.updated_at = new Date();
      await this.chatsRepository.save(userChat);
      return userChat;
    }

    if (contactChat) {
      contactChat.updated_at = new Date();
      await this.chatsRepository.save(contactChat);
    }

    return contactChat;
  }
}

export default CheckChatAlreadyExistsService;
