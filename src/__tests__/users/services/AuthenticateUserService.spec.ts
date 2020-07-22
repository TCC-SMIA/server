import AuthenticateUserService from '@domains/users/services/AuthenticateUserService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import UserTypes from '@domains/users/enums/UserEnums';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
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
      email: 'doe@doe.com',
      password: '123123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });
});
