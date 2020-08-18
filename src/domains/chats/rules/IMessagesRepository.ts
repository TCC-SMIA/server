import Message from '@domains/chats/infra/typeorm/entities/Message';

export default interface IMessagesRepository {
  create(messageData: Partial<Message>): Promise<Message>;
  update(message: Message): Promise<Message>;
}
