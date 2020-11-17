import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@tests/fakeProviders/FakeStorageProvider/FakeStorageProvider';
import FakeUsersRepository from '@tests/users/fakes/FakeUsersRepository';
import UpdateAvatarService from '@domains/users/services/UpdateAvatarService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IStorageProvider from '@shared/providers/StorageProvider/rules/IStorageProvider';
import { UserTypes } from '@domains/users/enums/UserEnums';

describe('UpdateAvatarService', () => {
  let updateAvatarService: UpdateAvatarService;
  let fakeUsersRepository: IUsersRepository;
  let fakeStorageProvider: IStorageProvider;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateAvatarService = new UpdateAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });

  it('should be able to update user avatar', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
      type: UserTypes.Reporter,
    });

    await updateAvatarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should be able to update agency avatar', async () => {
    const agency = await fakeUsersRepository.create({
      name: 'Valid Agency Name',
      cnpj: '60603851000150',
      email: 'validemail@email.com',
      password: '123456,',
      type: UserTypes.EnvironmentalAgency,
    });

    await updateAvatarService.execute({
      user_id: agency.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(agency.avatar).toBe('avatar.jpg');
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
      type: UserTypes.Reporter,
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
