import IMessagesRepository from '@domains/chat/rules/IMessagesRepository';
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
}

export default MessagesRepository;
