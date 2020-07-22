import AuthenticateUserService from '@domains/users/services/AuthenticateUserService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import AppError from '@shared/errors/AppError';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import { UserTypes } from '@domains/users/enums/UserEnums';
import FakeUsersRepository from '../fakes/FakeUsersRepository';
import FakeHashProvider from '../fakes/FakeHashProvider';
import FakeAgencyProvider from '../fakes/FakeAgencyProvider';

let fakeUsersRepository: IUsersRepository;
let authenticateUserService: AuthenticateUserService;
let fakeHashProvider: IHashProvider;
let fakeAgencyRepository: IAgencyRepository;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeAgencyRepository = new FakeAgencyProvider();
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeAgencyRepository,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    const response = await authenticateUserService.execute({
      email: 'doe@doe.com',
      password: '123123',
      user_type: UserTypes.Reporter,
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able authenticate with wrong email/password combination', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    await expect(
      authenticateUserService.execute({
        email: 'doe@doe.com',
        password: '1231232',
        user_type: UserTypes.Reporter,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able authenticate with wrong nickname/password combination', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    await expect(
      authenticateUserService.execute({
        nickname: 'johnzins',
        password: '1231232',
        user_type: UserTypes.Reporter,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able authenticate with a non existing user', async () => {
    await expect(
      authenticateUserService.execute({
        nickname: 'johnzins',
        password: '1231232',
        user_type: UserTypes.Reporter,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
