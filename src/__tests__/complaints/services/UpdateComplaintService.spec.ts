import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import UpdateComplaintService from '@domains/complaints/services/UpdateComplaintService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeNotificationsRepository from '@tests/notifications/fakes/FakeNotificationsRepository';
import CreateNotificationService from '@domains/notifications/services/CreateNotificationService';
import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import FakeUsersRepository from '../../users/fakes/FakeUsersRepository';
import FakeComplaintsRepository from '../fakes/FakeComplaintsRepository';

let fakeComplaintsRepository: IComplaintsRepository;
let updateComplaintService: UpdateComplaintService;
let fakeUsersRepository: IUsersRepository;
let fakeNotificationsRepository: INotificationsRepository;
let createNotificationService: CreateNotificationService;

describe('UpdateComplaintService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeComplaintsRepository = new FakeComplaintsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createNotificationService = new CreateNotificationService(
      fakeNotificationsRepository,
    );
    updateComplaintService = new UpdateComplaintService(
      fakeComplaintsRepository,
      createNotificationService,
    );
  });

  it('should be able to update the complaint', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

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

    const updatedComplaint = await updateComplaintService.execute({
      user_id: user.id,
      complaint_id: complaint.id,
      title: 'Updated complaint',
      description: 'Updating complaint in test',
      latitude: 1,
      longitude: 2,
      anonymous: false,
      date,
    });

    expect(updatedComplaint.title).toBe('Updated complaint');
    expect(updatedComplaint.description).toBe('Updating complaint in test');
    expect(updatedComplaint.latitude).toBe(1);
  });

  it('should not be able to update a non existing complaint', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    const date = new Date();

    await expect(
      updateComplaintService.execute({
        user_id: user.id,
        complaint_id: 'invalid_id',
        title: 'Updated complaint',
        description: '',
        latitude: 1,
        longitude: 2,
        anonymous: false,
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a complaint that user have not created', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

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
      updateComplaintService.execute({
        user_id: 'invalid_id',
        complaint_id: complaint.id,
        title: 'Updated complaint',
        description: '',
        latitude: 1,
        longitude: 2,
        anonymous: false,
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the complaint and exclude user data if complaint is anonymouys', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

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

    const updatedComplaint = await updateComplaintService.execute({
      user_id: user.id,
      complaint_id: complaint.id,
      title: 'Updated complaint',
      description: '',
      latitude: 1,
      longitude: 2,
      anonymous: true,
      date,
    });

    expect(updatedComplaint.title).toBe('Updated complaint');
  });
});
