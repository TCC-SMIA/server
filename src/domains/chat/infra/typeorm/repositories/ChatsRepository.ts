import IChatsRepository from '@domains/chat/rules/IChatsRepository';
import { Repository, getRepository } from 'typeorm';
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
}

export default ChatsRepository;