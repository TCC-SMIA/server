import AuthenticateUserService from '@domains/users/services/AuthenticateUserService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import AppError from '@shared/errors/AppError';
import { UserTypes } from '@domains/users/enums/UserEnums';
import FakeUsersRepository from '../fakes/FakeUsersRepository';
import FakeHashProvider from '../fakes/FakeHashProvider';

let fakeUsersRepository: IUsersRepository;
let authenticateUserService: AuthenticateUserService;
let fakeHashProvider: IHashProvider;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
      type: UserTypes.Reporter,
    });

    const response = await authenticateUserService.execute({
      login: 'doe@doe.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user.id).toBeTruthy();
    expect(response.user.id).toBe(user.id);
    expect(response.user.email).toBe(user.email);
    expect(response.user.type).toBe(UserTypes.Reporter);
  });

  it('should not be able authenticate with wrong email/password combination', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
      type: UserTypes.Reporter,
    });

    await expect(
      authenticateUserService.execute({
        login: 'doe@doe.com',
        password: '1231232',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able authenticate with wrong nickname/password combination', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
      type: UserTypes.Reporter,
    });

    await expect(
      authenticateUserService.execute({
        login: 'johnzins',
        password: '1231232',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able authenticate with a non existing user', async () => {
    await expect(
      authenticateUserService.execute({
        login: 'johnzins',
        password: '1231232',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to authenticate an environmental agency', async () => {
    const user = await fakeUsersRepository.create({
      name: 'any_name',
      email: 'mail@mail.com',
      password: '123123',
      cnpj: '12312331231',
      type: UserTypes.EnvironmentalAgency,
    });

    const response = await authenticateUserService.execute({
      login: 'mail@mail.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user.id).toBe(user.id);
    expect(response.user.email).toBe(user.email);
    expect(response.user.type).toBe(UserTypes.EnvironmentalAgency);
  });

  it('should not be able to authenticate an environmental agency without sending an email', async () => {
    await expect(
      authenticateUserService.execute({
        login: '',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should authenticate an User with correct values', async () => {
    const executeMock = jest.spyOn(authenticateUserService, 'execute');

    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
      type: UserTypes.Reporter,
    });

    await authenticateUserService.execute({
      login: 'doe@doe.com',
      password: '123123',
    });

    expect(executeMock).toHaveBeenCalledWith({
      login: 'doe@doe.com',
      password: '123123',
    });
  });

  it('should authenticate an Agency with correct values', async () => {
    const executeMock = jest.spyOn(authenticateUserService, 'execute');

    await fakeUsersRepository.create({
      name: 'any_name',
      email: 'mail@mail.com',
      password: '123123',
      cnpj: '12312331231',
      type: UserTypes.EnvironmentalAgency,
    });

    await authenticateUserService.execute({
      login: 'mail@mail.com',
      password: '123123',
    });

    expect(executeMock).toHaveBeenCalledWith({
      login: 'mail@mail.com',
      password: '123123',
    });
  });
});
