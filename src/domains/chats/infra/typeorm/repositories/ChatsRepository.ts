import IChatsRepository from '@domains/chats/rules/IChatsRepository';
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

  public async findAllByUser(user_id: string): Promise<Chat[]> {
    return this.chatsRepository.find({ where: { user: user_id } });
  }

  public async findById(chat_id: string): Promise<Chat | undefined> {
    return this.chatsRepository.findOne({ where: { id: chat_id } });
  }
}

export default ChatsRepository;
