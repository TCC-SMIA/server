import IChatsRepository from '@domains/chats/rules/IChatsRepository';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import CheckChatAlreadyExistsService from '@domains/chats/services/CheckChatAlreadyExistsService';
import FakeUsersRepository from '@tests/users/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import { reporterMock } from '@tests/__mocks__/User.mock';

import FakeChatsRepository from '../fakes/FakeChatsRepository';

let fakeChatsRepository: IChatsRepository;
let fakeUsersRepository: IUsersRepository;
let service: CheckChatAlreadyExistsService;

describe('CheckChatAlreadyExistsService', () => {
  beforeEach(() => {
    fakeChatsRepository = new FakeChatsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    service = new CheckChatAlreadyExistsService(
      fakeChatsRepository,
      fakeUsersRepository,
    );
  });

  it('should be able to check if chat already exist', async () => {
    const user = await fakeUsersRepository.create(reporterMock);

    const contact = await fakeUsersRepository.create(reporterMock);

    const doesExists = await service.execute({
      user_id: user.id,
      contact_id: contact.id,
    });

    expect(doesExists).toBe(undefined);
  });

  it('should be able to check if chat already exist', async () => {
    const user = await fakeUsersRepository.create(reporterMock);

    const contact = await fakeUsersRepository.create(reporterMock);

    await fakeChatsRepository.create({
      user,
      user_id: user.id,
      destinatary: contact,
    });

    const doesExists = await service.execute({
      user_id: user.id,
      contact_id: contact.id,
    });

    expect(doesExists).toBeTruthy();
    expect(doesExists?.user_id).toBe(user.id);
    expect(doesExists?.destinatary).toEqual(contact);
  });

  it('should not be able to check if chat already exists from a invalid user', async () => {
    const contact = await fakeUsersRepository.create(reporterMock);

    await expect(
      service.execute({
        user_id: 'Invalid_Id',
        contact_id: contact.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to check if chat already exists from a invalid contact', async () => {
    const user = await fakeUsersRepository.create(reporterMock);

    await expect(
      service.execute({
        user_id: user.id,
        contact_id: 'Invalid_Id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
