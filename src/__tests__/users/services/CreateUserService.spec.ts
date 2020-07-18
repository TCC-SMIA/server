import CreateUserService from 'domains/users/services/CreateUserService';
import IUsersRepository from 'domains/users/rules/IUsersRepository';
import UserTypes from 'domains/users/enums/UserEnums';
import FakeUsersRepository from '../fakes/FakeUsersRepository';

describe('CreateUserService', () => {
  let fakeUsersRepository: IUsersRepository;
  let createUserService: CreateUserService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    createUserService = new CreateUserService(fakeUsersRepository);
  });

  it('Should be able to create a new reporter', async () => {
    const user = await createUserService.execute({
      name: 'jhon',
      email: 'doe@doe.com',
      nickname: 'johnzin',
      password: '123123',
      type: UserTypes.Reporter,
    });

    expect(user.name).toBe('jhon');
  });
});
