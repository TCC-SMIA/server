import UpdateProfileService from '@domains/users/services/UpdateProfileService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../fakes/FakeUsersRepository';
import FakeHashProvider from '../fakes/FakeHashProvider';

let fakeUsersRepository: IUsersRepository;
let updateProfileService: UpdateProfileService;
let fakeHashProvider: IHashProvider;

describe('UpdateProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    const updatedUser = await updateProfileService.execute({
      userId: user.id,
      name: 'Young Man',
      email: 'youngman@teste.com',
      nickname: 'youngman',
    });

    expect(updatedUser.name).toBe('Young Man');
    expect(updatedUser.nickname).toBe('youngman');
    expect(updatedUser.email).toBe('youngman@teste.com');
  });

  it('should be able to update the user password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    const updatedUser = await updateProfileService.execute({
      userId: user.id,
      name: 'Young Man',
      email: 'youngman@teste.com',
      nickname: 'youngman',
      oldpassword: '123123',
      password: '123456',
      password_confirmation: '123456',
    });

    expect(updatedUser.name).toBe('Young Man');
    expect(updatedUser.nickname).toBe('youngman');
    expect(updatedUser.email).toBe('youngman@teste.com');
    expect(updatedUser.password).toBe('123456');
  });

  it('should not be able to update a non existing user', async () => {
    await expect(
      updateProfileService.execute({
        userId: 'NonExistingId',
        name: 'John Doe',
        email: 'doe@doe.com',
        nickname: 'johnzins',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the user nickname that is already used', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    const user = await fakeUsersRepository.create({
      name: 'Young Man',
      email: 'youngman@teste.com',
      nickname: 'youngman',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: 'Young Man',
        email: 'youngman@teste.com',
        nickname: 'johnzins',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the user email that is already used', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    const user = await fakeUsersRepository.create({
      name: 'Young Man',
      email: 'youngman@teste.com',
      nickname: 'youngman',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: 'Young Man',
        email: 'doe@doe.com',
        nickname: 'youngman',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the user password when there is not old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Young Man',
      email: 'youngman@teste.com',
      nickname: 'youngman',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: 'Young Man',
        email: 'doe@doe.com',
        nickname: 'youngman',
        password: '123456',
        password_confirmation: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the user password with the old password wrong', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Young Man',
      email: 'youngman@teste.com',
      nickname: 'youngman',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: 'Young Man',
        email: 'doe@doe.com',
        nickname: 'youngman',
        oldpassword: 'wrongPassword',
        password: '123456',
        password_confirmation: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the user password with differents password and passwordconfirmation', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Young Man',
      email: 'youngman@teste.com',
      nickname: 'youngman',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        userId: user.id,
        name: 'Young Man',
        email: 'doe@doe.com',
        nickname: 'youngman',
        oldpassword: '123456',
        password: 'wrongPassword1',
        password_confirmation: 'wrongPassword2',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});