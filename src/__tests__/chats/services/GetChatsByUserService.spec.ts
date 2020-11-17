import IChatsRepository from '@domains/chats/rules/IChatsRepository';
import GetChatsByUserService from '@domains/chats/services/GetChatsByUserService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@tests/users/fakes/FakeUsersRepository';
import { reporterMock } from '@tests/__mocks__/User.mock';
import FakeChatsRepository from '../fakes/FakeChatsRepository';

let fakeChatsRepository: IChatsRepository;
let fakeUsersRepository: IUsersRepository;
let service: GetChatsByUserService;

describe('GetChatsByUserService', () => {
  beforeAll(() => {
    fakeChatsRepository = new FakeChatsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    service = new GetChatsByUserService(
      fakeChatsRepository,
      fakeUsersRepository,
    );
  });

  it('Should be able to get the user chat', async () => {
    const user = await fakeUsersRepository.create(reporterMock);

    const chats = await service.execute({ user_id: user.id });

    expect(chats).toBeTruthy();
    expect(chats).toBeInstanceOf(Array);
  });

  it('Should not be able to get the list of chats if user does not exists', async () => {
    await expect(
      service.execute({ user_id: 'invalid_id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
