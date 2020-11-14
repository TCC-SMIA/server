import IMessagesRepository from '@domains/chats/rules/IMessagesRepository';
import { Repository, getRepository } from 'typeorm';
import Message from '../entities/Message';

class MessagesRepository implements IMessagesRepository {
  private messagesRepository: Repository<Message>;

  constructor() {
    this.messagesRepository = getRepository(Message);
  }

  public async create(messageData: Partial<Message>): Promise<Message> {
    const message = this.messagesRepository.create(messageData);

    await this.messagesRepository.save(message);

    return message;
  }

  public async update(message: Message): Promise<Message> {
    return this.messagesRepository.save(message);
  }

  public async findAllByChat(chat_id: string): Promise<Message[]> {
    return this.messagesRepository.find({
      where: { chat_id },
      order: { created_at: 'ASC' },
    });
  }
}

export default MessagesRepository;
