import AppError from '@shared/errors/AppError';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IStorageProvider from '@shared/providers/StorageProvider/rules/IStorageProvider';
import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import FakeUsersRepository from '@tests/users/fakes/FakeUsersRepository';
import FakeStorageProvider from '@tests/fakeProviders/FakeStorageProvider/FakeStorageProvider';
import UpdateImageComplaintService from '@domains/complaints/services/UpdateImageComplaintService';
import FakeComplaintsRepository from '../fakes/FakeComplaintsRepository';

describe('UpdateImageComplaintService', () => {
  let fakeUsersRepository: IUsersRepository;
  let fakeStorageProvider: IStorageProvider;
  let fakeComplaintsRepository: IComplaintsRepository;
  let updateImageComplaintService: UpdateImageComplaintService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeComplaintsRepository = new FakeComplaintsRepository();

    updateImageComplaintService = new UpdateImageComplaintService(
      fakeUsersRepository,
      fakeStorageProvider,
      fakeComplaintsRepository,
    );
  });

  it('should be able to update the complaint image', async () => {
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

    const updatedComplaint = await updateImageComplaintService.execute({
      complaint_id: complaint.id,
      user_id: user.id,
      imageFilename: 'imageTest.jpg',
    });

    expect(updatedComplaint.image).toBe('imageTest.jpg');
  });

  it('should not be able to update image from non existing complaint', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    await expect(
      updateImageComplaintService.execute({
        complaint_id: 'invalidComplaintId',
        user_id: user.id,
        imageFilename: 'imageTest.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update image from non existing user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    const userSecondary = await fakeUsersRepository.create({
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
      updateImageComplaintService.execute({
        complaint_id: complaint.id,
        user_id: userSecondary.id,
        imageFilename: 'imageTest.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update image when user id and complaint user_id does not match', async () => {
    const date = new Date();

    const complaint = await fakeComplaintsRepository.create({
      user_id: 'invalidUserId',
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      latitude: -222222,
      longitude: 222222,
      anonymous: true,
      date,
    });

    await expect(
      updateImageComplaintService.execute({
        complaint_id: complaint.id,
        user_id: 'invalidUserId',
        imageFilename: 'imageTest.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

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

    await updateImageComplaintService.execute({
      complaint_id: complaint.id,
      imageFilename: 'image.jpg',
      user_id: user.id,
    });

    await updateImageComplaintService.execute({
      complaint_id: complaint.id,
      imageFilename: 'image2.jpg',
      user_id: user.id,
    });

    expect(deleteFile).toHaveBeenCalledWith('image.jpg');
    expect(complaint.image).toBe('image2.jpg');
  });
});
