import CreateUserService from '@modules/users/services/CreateUserService';
import IUsersRepository from '@modules/users/rules/IUsersRepository';
import FakeUsersRepository from '../fakes/FakeUsersRepository';

describe('CreateUserService', () => {
  let fakeUsersRepository: IUsersRepository;
  let createUserService: CreateUserService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    createUserService = new CreateUserService(fakeUsersRepository);
  });

  it('Should be able to create a new user', async () => {
    const user = await createUserService.execute();

    expect(user.name).toBe('aaa');
  });
});
