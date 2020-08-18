import Message from '@domains/chat/infra/typeorm/entities/Message';

export default interface IMessagesRepository {
  create(messageData: Partial<Message>): Promise<Message>;
  update(message: Message): Promise<Message>;
}
