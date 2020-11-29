import Chat from '@domains/chats/infra/typeorm/entities/Chat';
import User from '@domains/users/infra/typeorm/entities/User';

export default interface IChatsRepository {
  create(chatData: Partial<Chat>): Promise<Chat>;
  update(chat: Chat): Promise<Chat>;
  findAllByUser(user_id: string): Promise<Chat[]>;
  findById(chat_id: string): Promise<Chat | undefined>;
  doesExist(user_id: string, destinatary: User): Promise<Chat | undefined>;
  save(chat: Partial<Chat>): Promise<Chat>;
}
