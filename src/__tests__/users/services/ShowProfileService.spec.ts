import IUsersRepository from '@domains/users/rules/IUsersRepository';
import ShowProfileService from '@domains/users/services/ShowProfileService';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../fakes/FakeUsersRepository';

let fakeUsersRepository: IUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfileService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('should be able to show the user logged', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    const profile = await showProfileService.execute({ userId: user.id });

    expect(profile.name).toBe('John Doe');
    expect(profile.nickname).toBe('johnzins');
    expect(profile.email).toBe('doe@doe.com');
  });

  it('should not be able to show a non existing user', async () => {
    await expect(
      showProfileService.execute({ userId: 'DontExistingId' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
