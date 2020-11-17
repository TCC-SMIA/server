import DeleteProfileService from '@domains/users/services/DeleteProfileService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import { UserTypes } from '@domains/users/enums/UserEnums';
import FakeUsersRepository from '../fakes/FakeUsersRepository';

describe('DeleteProfileService', () => {
  let fakeUsersRepository: IUsersRepository;
  let deleteProfileService: DeleteProfileService;

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    deleteProfileService = new DeleteProfileService(fakeUsersRepository);
  });

  it('should be able to delete user logged', async () => {
    const user = await fakeUsersRepository.create({
      name: 'jhon',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
      type: UserTypes.Reporter,
    });

    const deleteFunction = jest.spyOn(fakeUsersRepository, 'delete');

    await deleteProfileService.execute({ userId: user.id });

    expect(deleteFunction).toBeCalledWith(user);
  });

  it('should not be able to delete a non existing user', async () => {
    await expect(
      deleteProfileService.execute({ userId: 'NonExistsID' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
