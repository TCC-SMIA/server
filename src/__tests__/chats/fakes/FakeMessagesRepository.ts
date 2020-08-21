import { v4 } from 'uuid';

import Message from '@domains/chats/infra/typeorm/entities/Message';
import IMessagesRepository from '@domains/chats/rules/IMessagesRepository';

class FakeMessagesRepository implements IMessagesRepository {
  private messages: Message[] = [];

  public async create(messageData: Partial<Message>): Promise<Message> {
    const message = new Message();

    Object.assign(message, { id: v4() }, messageData);

    this.messages.push(message);

    return message;
  }

  public async update(message: Message): Promise<Message> {
    const messageIndex = this.messages.findIndex(
      findMessage => findMessage.id === message.id,
    );

    this.messages[messageIndex] = message;

    return this.messages[messageIndex];
  }

  public async findAllByChat(chat_id: string): Promise<Message[]> {
    return this.messages.filter(message => message.chat_id === chat_id);
  }
}

export default FakeMessagesRepository;
