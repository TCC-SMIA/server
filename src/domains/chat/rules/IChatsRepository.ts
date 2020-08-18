import Chat from '@domains/chat/infra/typeorm/entities/Chat';

export default interface IChatsRepository {
  create(chatData: Partial<Chat>): Promise<Chat>;
  update(chat: Chat): Promise<Chat>;
}
