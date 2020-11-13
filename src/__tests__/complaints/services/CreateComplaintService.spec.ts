import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import CreateComplaintService from '@domains/complaints/services/CreateComplaintService';
import IStorageProvider from '@shared/providers/StorageProvider/rules/IStorageProvider';
import FakeStorageProvider from '@tests/fakeProviders/FakeStorageProvider/FakeStorageProvider';
import FakeAgencyRepository from '@tests/users/fakes/FakeAgencyRepository';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import AppError from '@shared/errors/AppError';
import CreateNotificationService from '@domains/notifications/services/CreateNotificationService';
import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import FakeNotificationsRepository from '@tests/notifications/fakes/FakeNotificationsRepository';
import FakeUsersRepository from '@tests/users/fakes/FakeUsersRepository';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import FakeComplaintsRepository from '../fakes/FakeComplaintsRepository';

let fakeComplaintsRepository: IComplaintsRepository;
let fakeStorageProvider: IStorageProvider;
let createComplaintService: CreateComplaintService;
let fakeAgencyRepository: IAgencyRepository;
let fakeNotificationsRepository: INotificationsRepository;
let fakeUsersRepository: IUsersRepository;
let createNotificationService: CreateNotificationService;

describe('CreateComplaintService', () => {
  beforeEach(() => {
    fakeComplaintsRepository = new FakeComplaintsRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeAgencyRepository = new FakeAgencyRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    createNotificationService = new CreateNotificationService(
      fakeNotificationsRepository,
    );

    createComplaintService = new CreateComplaintService(
      fakeComplaintsRepository,
      fakeStorageProvider,
      fakeAgencyRepository,
      createNotificationService,
    );
  });

  it('should be able to create a complaint', async () => {
    const user = await fakeUsersRepository.create({
      email: 'valid@mail.com',
      name: 'valid_name',
      nickname: 'valid_nickname',
      password: 'valid_password',
    });

    const date = new Date();

    const complaint = await createComplaintService.execute({
      user_id: user.id,
      title: 'test complaint created',
      description: 'description of complaint created',
      imageFilename: 'image.jpg',
      latitude: -222222,
      longitude: 222222,
      anonymous: false,
      date,
    });

    expect(complaint).toBeTruthy();
    expect(complaint.id).toBeTruthy();
    expect(complaint.title).toBe('test complaint created');
    expect(complaint.description).toBe('description of complaint created');
    expect(complaint.latitude).toBe(-222222);
    expect(complaint.longitude).toBe(222222);
    expect(complaint.anonymous).toBe(false);
    expect(complaint.date).toEqual(date);
    expect(complaint.image).toBe('image.jpg');
  });

  it('should be able to create a anonymous complaint', async () => {
    const createMock = jest.spyOn(fakeComplaintsRepository, 'create');

    const date = new Date();

    const user = await fakeUsersRepository.create({
      email: 'valid@mail.com',
      name: 'valid_name',
      nickname: 'valid_nickname',
      password: 'valid_password',
    });

    const complaint = await createComplaintService.execute({
      user_id: user.id,
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      latitude: -222222,
      longitude: 222222,
      anonymous: true,
      date,
    });

    expect(complaint).toBeTruthy();
    expect(complaint.id).toBeTruthy();
    expect(complaint.title).toBe('New anonynmous Complaint');
    expect(complaint.description).toBe('We found a new planet');
    expect(complaint.latitude).toBe(-222222);
    expect(complaint.longitude).toBe(222222);
    expect(complaint.date).toEqual(date);
    expect(createMock).toHaveBeenCalledWith({
      user_id: user.id,
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      image: undefined,
      city: undefined,
      state: undefined,
      latitude: -222222,
      longitude: 222222,
      anonymous: true,
      date,
    });
  });

  it('should not permit an environmental agency create a complaint', async () => {
    const date = new Date();

    const agency = await fakeAgencyRepository.create({
      name: 'valid_agency_name',
      email: 'same_email@mail.com',
      cnpj: '62728791000128',
      password: 'valid_password',
      latitude: -222222,
      longitude: 222222,
    });

    await expect(
      createComplaintService.execute({
        user_id: agency.id,
        title: 'New anonynmous Complaint',
        description: 'We found a new planet',
        latitude: -222222,
        longitude: 222222,
        anonymous: true,
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
