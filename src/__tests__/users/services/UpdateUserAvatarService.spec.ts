import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@tests/fakeProviders/FakeStorageProvider/FakeStorageProvider';
import FakeUsersRepository from '@tests/users/fakes/FakeUsersRepository';
import UpdateAvatarService from '@domains/users/services/UpdateAvatarService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IStorageProvider from '@shared/providers/StorageProvider/rules/IStorageProvider';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import FakeAgencyRepository from '../fakes/FakeAgencyRepository';

describe('UpdateAvatarService', () => {
  let updateAvatarService: UpdateAvatarService;
  let fakeUsersRepository: IUsersRepository;
  let fakeAgencysRepository: IAgencyRepository;
  let fakeStorageProvider: IStorageProvider;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAgencysRepository = new FakeAgencyRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateAvatarService = new UpdateAvatarService(
      fakeUsersRepository,
      fakeAgencysRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar from non existing user', async () => {
    await expect(
      updateAvatarService.execute({
        user_id: 'non-existing-user',
        avatarFilename: 'avatar.jpg',
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

    await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
