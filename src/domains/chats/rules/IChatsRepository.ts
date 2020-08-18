import Chat from '@domains/chats/infra/typeorm/entities/Chat';

export default interface IChatsRepository {
  create(chatData: Partial<Chat>): Promise<Chat>;
  update(chat: Chat): Promise<Chat>;
}
