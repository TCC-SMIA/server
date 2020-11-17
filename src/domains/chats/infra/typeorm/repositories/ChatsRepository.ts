import { Repository, getRepository } from 'typeorm';

import IChatsRepository from '@domains/chats/rules/IChatsRepository';
import User from '@domains/users/infra/typeorm/entities/User';
import Chat from '../entities/Chat';

class ChatsRepository implements IChatsRepository {
  private chatsRepository: Repository<Chat>;

  constructor() {
    this.chatsRepository = getRepository(Chat);
  }

  public async create(chatData: Partial<Chat>): Promise<Chat> {
    const chat = this.chatsRepository.create(chatData);

    await this.chatsRepository.save(chat);

    return chat;
  }

  public async update(chat: Chat): Promise<Chat> {
    return this.chatsRepository.save(chat);
  }

  public async findAllByUser(user_id: string): Promise<Chat[]> {
    const user_chats = await this.chatsRepository.find({
      where: { user_id },
      order: { created_at: 'DESC' },
    });

    const destinatary_chats = await this.chatsRepository.find({
      where: { destinatary: user_id },
      order: { created_at: 'DESC' },
    });

    return [...user_chats, ...destinatary_chats];
  }

  public async findById(chat_id: string): Promise<Chat | undefined> {
    return this.chatsRepository.findOne({ where: { id: chat_id } });
  }

  public async doesExist(
    user_id: string,
    destinatary: User,
  ): Promise<Chat | undefined> {
    return this.chatsRepository.findOne({
      where: { user_id, destinatary },
    });
  }
}

export default ChatsRepository;
