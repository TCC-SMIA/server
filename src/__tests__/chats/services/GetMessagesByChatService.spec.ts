import IChatsRepository from '@domains/chats/rules/IChatsRepository';
import IMessagesRepository from '@domains/chats/rules/IMessagesRepository';
import GetMessagesByChatService from '@domains/chats/services/GetMessagesByChatService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@tests/users/fakes/FakeUsersRepository';
import { reporterMock } from '@tests/__mocks__/User.mock';
import FakeChatsRepository from '../fakes/FakeChatsRepository';
import FakeMessagesRepository from '../fakes/FakeMessagesRepository';

let fakeChatsRepository: IChatsRepository;
let fakeMessagesRepository: IMessagesRepository;
let fakeUsersRepository: IUsersRepository;
let service: GetMessagesByChatService;

describe('GetChatsByUserService', () => {
  beforeAll(() => {
    fakeChatsRepository = new FakeChatsRepository();
    fakeMessagesRepository = new FakeMessagesRepository();
    fakeUsersRepository = new FakeUsersRepository();
    service = new GetMessagesByChatService(
      fakeChatsRepository,
      fakeMessagesRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to get the chat messages', async () => {
    const user = await fakeUsersRepository.create(reporterMock);
    const destinatary = await fakeUsersRepository.create(reporterMock);

    const chat = await fakeChatsRepository.create({
      user,
      user_id: user.id,
      destinatary,
    });

    const messages = await service.execute({
      user_id: user.id,
      chat_id: chat.id,
    });

    expect(messages).toBeTruthy();
    expect(messages).toBeInstanceOf(Array);
  });

  it('Should not be able to get the messages if user does not exists', async () => {
    const user = await fakeUsersRepository.create(reporterMock);
    const destinatary = await fakeUsersRepository.create(reporterMock);

    const chat = await fakeChatsRepository.create({
      user,
      user_id: user.id,
      destinatary,
    });

    await expect(
      service.execute({
        user_id: 'user.id',
        chat_id: chat.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to get the messages if chat does not exists', async () => {
    const user = await fakeUsersRepository.create(reporterMock);
    const destinatary = await fakeUsersRepository.create(reporterMock);

    await fakeChatsRepository.create({
      user,
      user_id: user.id,
      destinatary,
    });

    await expect(
      service.execute({
        user_id: user.id,
        chat_id: 'chat.id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
