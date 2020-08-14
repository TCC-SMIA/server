import 'reflect-metadata';
import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import CreateNotificationService from '@domains/notifications/services/CreateNotificationService';
import FakeNotificationsRepository from '../fakes/FakeNotificationsRepository';

let createNotificationService: CreateNotificationService;
let fakeNotificationsRepository: INotificationsRepository;

describe('CreateComplaintService', () => {
  beforeEach(() => {
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createNotificationService = new CreateNotificationService(
      fakeNotificationsRepository,
    );
  });

  it('Should be able to create a Notification', async () => {
    const createMock = jest.spyOn(fakeNotificationsRepository, 'create');

    await createNotificationService.execute({
      user_id: 'valid_id',
      content: 'New notification',
    });

    expect(createMock).toHaveBeenCalledWith({
      user_id: 'valid_id',
      content: 'New notification',
    });
  });
});
