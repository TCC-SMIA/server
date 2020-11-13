import 'reflect-metadata';
import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import CreateNotificationService from '@domains/notifications/services/CreateNotificationService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import FakeUsersRepository from '@tests/users/fakes/FakeUsersRepository';
import FakeNotificationsRepository from '../fakes/FakeNotificationsRepository';

let createNotificationService: CreateNotificationService;
let fakeNotificationsRepository: INotificationsRepository;
let fakeUsersRepository: IUsersRepository;

describe('CreateComplaintService', () => {
  beforeEach(() => {
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    createNotificationService = new CreateNotificationService(
      fakeNotificationsRepository,
    );
  });

  it('Should be able to create a Notification', async () => {
    const createMock = jest.spyOn(fakeNotificationsRepository, 'create');

    const user = await fakeUsersRepository.create({
      email: 'valid@mail.com',
      name: 'valid_name',
      nickname: 'valid_nickname',
      password: 'valid_password',
    });

    await createNotificationService.execute({
      user_id: user.id,
      content: 'New notification',
    });

    expect(createMock).toHaveBeenCalledWith({
      user_id: user.id,
      content: 'New notification',
    });
  });
});
