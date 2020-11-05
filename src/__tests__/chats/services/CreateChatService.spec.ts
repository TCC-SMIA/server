import IChatsRepository from '@domains/chats/rules/IChatsRepository';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import CreateChatService from '@domains/chats/services/CreateChatService';
import FakeUsersRepository from '@tests/users/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeChatsRepository from '../fakes/FakeChatsRepository';

let fakeChatsRepository: IChatsRepository;
let fakeUsersRepository: IUsersRepository;
let createChatService: CreateChatService;

describe('CreateChatService', () => {
  beforeEach(() => {
    fakeChatsRepository = new FakeChatsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    createChatService = new CreateChatService(
      fakeChatsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to create a new chat', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    const contact = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'tre@tre.com',
      nickname: 'trezins',
      password: '123123',
    });

    const newChat = await createChatService.execute({
      user_id: user.id,
      contact_id: contact.id,
    });

    expect(newChat).toBeTruthy();
    expect(newChat.id).toBeTruthy();
    expect(newChat.user_id).toBe(user.id);
    expect(newChat.destinatary.id).toBe(contact.id);
  });

  it('should not be able to create a chat with nonexistent user', async () => {
    const contact = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'tre@tre.com',
      nickname: 'trezins',
      password: '123123',
    });

    await expect(
      createChatService.execute({
        user_id: 'Invalid_Id',
        contact_id: contact.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a chat with nonexistent contact', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'tre@tre.com',
      nickname: 'trezins',
      password: '123123',
    });

    await expect(
      createChatService.execute({
        user_id: user.id,
        contact_id: 'Invalid_Id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
