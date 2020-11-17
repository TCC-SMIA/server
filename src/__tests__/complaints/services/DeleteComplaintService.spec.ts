import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import DeleteComplaintService from '@domains/complaints/services/DeleteComplaintService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import FakeNotificationsRepository from '@tests/notifications/fakes/FakeNotificationsRepository';
import CreateNotificationService from '@domains/notifications/services/CreateNotificationService';
import { reporterMock } from '@tests/__mocks__/User.mock';
import FakeUsersRepository from '../../users/fakes/FakeUsersRepository';
import FakeComplaintsRepository from '../fakes/FakeComplaintsRepository';

let fakeComplaintsRepository: IComplaintsRepository;
let deleteComplaintService: DeleteComplaintService;
let fakeUsersRepository: IUsersRepository;
let fakeNotificationsRepository: INotificationsRepository;
let createNotificationService: CreateNotificationService;

describe('DeleteComplaintService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeComplaintsRepository = new FakeComplaintsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createNotificationService = new CreateNotificationService(
      fakeNotificationsRepository,
    );
    deleteComplaintService = new DeleteComplaintService(
      fakeComplaintsRepository,
      createNotificationService,
    );
  });

  it('should be able to delete the complaint', async () => {
    const user = await fakeUsersRepository.create(reporterMock);

    const date = new Date();

    const complaint = await fakeComplaintsRepository.create({
      user_id: user.id,
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      latitude: -222222,
      longitude: 222222,
      anonymous: true,
      date,
    });

    const deleteFuncion = jest.spyOn(fakeComplaintsRepository, 'delete');

    await deleteComplaintService.execute({
      user_id: user.id,
      complaint_id: complaint.id,
    });

    expect(deleteFuncion).toBeCalledWith(complaint);
  });

  it('should not be able to delete a non existing complaint', async () => {
    const user = await fakeUsersRepository.create(reporterMock);

    await expect(
      deleteComplaintService.execute({
        user_id: user.id,
        complaint_id: 'invalid_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a non complaint that user have not created', async () => {
    const user = await fakeUsersRepository.create(reporterMock);

    const date = new Date();

    const complaint = await fakeComplaintsRepository.create({
      user_id: user.id,
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      latitude: -222222,
      longitude: 222222,
      anonymous: true,
      date,
    });

    await expect(
      deleteComplaintService.execute({
        user_id: 'invalid_id',
        complaint_id: complaint.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
