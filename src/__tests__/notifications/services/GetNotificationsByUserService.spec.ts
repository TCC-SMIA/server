import 'reflect-metadata';

import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import GetNotificationsByUserService from '@domains/notifications/services/GetNotificationsByUserService';
import FakeUsersRepository from '@tests/users/fakes/FakeUsersRepository';
import User from '@domains/users/infra/typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '../fakes/FakeNotificationsRepository';

let getNotificationsByUserService: GetNotificationsByUserService;
let fakeNotificationsRepository: INotificationsRepository;
let fakeUsersRepository: FakeUsersRepository;

describe('CreateComplaintService', () => {
  beforeEach(() => {
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeUsersRepository = new FakeUsersRepository();

    getNotificationsByUserService = new GetNotificationsByUserService(
      fakeUsersRepository,
      fakeNotificationsRepository,
    );
  });

  it('Should be able to get notifications by user', async () => {
    jest
      .spyOn(fakeUsersRepository, 'findById')
      .mockReturnValueOnce(Promise.resolve({ id: '1' } as User));

    const notifications = await getNotificationsByUserService.execute({
      user_id: 'valid_id',
    });

    expect(notifications).toBeTruthy();
    expect(notifications).toBeInstanceOf(Array);
  });

  it('Should not be able to get the notifications if user not exists', async () => {
    await expect(
      getNotificationsByUserService.execute({
        user_id: 'valid_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
