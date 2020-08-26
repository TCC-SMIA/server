import { v4 } from 'uuid';

import Chat from '@domains/chats/infra/typeorm/entities/Chat';
import IChatsRepository from '@domains/chats/rules/IChatsRepository';

class FakeChatsRepository implements IChatsRepository {
  private chats: Chat[] = [];

  public async create(chatData: Partial<Chat>): Promise<Chat> {
    const chat = new Chat();

    Object.assign(chat, { id: v4() }, chatData);

    this.chats.push(chat);

    return chat;
  }

  public async update(chat: Chat): Promise<Chat> {
    const chatIndex = this.chats.findIndex(findChat => findChat.id === chat.id);

    this.chats[chatIndex] = chat;

    return this.chats[chatIndex];
  }

  public async findAllByUser(user_id: string): Promise<Chat[]> {
    return this.chats.filter((chat, index) => chat.users[index].id === user_id);
  }

  public async findById(chat_id: string): Promise<Chat | undefined> {
    const chatExists = this.chats.find(chat => chat.id === chat_id);

    return chatExists;
  }
}

export default FakeChatsRepository;
