import 'reflect-metadata';

import ReadNotificationService from '@domains/notifications/services/ReadNotificationService';
import Notification from '@domains/notifications/infra/typeorm/entities/Notification';
import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '../fakes/FakeNotificationsRepository';

let fakeNotificationsRepository: FakeNotificationsRepository;

let service: ReadNotificationService;

describe('ReadNotificationService', () => {
  beforeAll(() => {
    fakeNotificationsRepository = new FakeNotificationsRepository();

    service = new ReadNotificationService(fakeNotificationsRepository);
  });

  it('Should be able to read a notification', async () => {
    jest.spyOn(fakeNotificationsRepository, 'findById').mockReturnValueOnce(
      Promise.resolve({
        id: 'valid_id',
        read: false,
        user: { id: 'valid_id' },
      } as Notification),
    );

    await service.execute({ user_id: 'valid_id', notification_id: 'valid_id' });
  });

  it('Should not be able to read a notification if notification does not exists', async () => {
    await expect(
      service.execute({ user_id: 'valid_id', notification_id: 'valid_id' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to read a notification if requester is not the owner', async () => {
    jest.spyOn(fakeNotificationsRepository, 'findById').mockReturnValueOnce(
      Promise.resolve({
        id: 'valid_id',
        read: false,
        user: { id: 'valid_id' },
      } as Notification),
    );

    await expect(
      service.execute({ user_id: 'invalid_id', notification_id: 'valid_id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
