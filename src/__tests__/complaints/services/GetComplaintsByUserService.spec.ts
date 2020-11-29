import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import GetComplaintsByUserService from '@domains/complaints/services/GetComplaintsByUserService';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@tests/users/fakes/FakeUsersRepository';
import FakeComplaintsRepository from '../fakes/FakeComplaintsRepository';
import { reporterMock } from '../../__mocks__/User.mock';

let fakeUsersRepsoitory: IUsersRepository;
let fakeComplaintsRepository: IComplaintsRepository;
let service: GetComplaintsByUserService;

describe('GetComplaintsByUserService', () => {
  beforeAll(() => {
    fakeUsersRepsoitory = new FakeUsersRepository();
    fakeComplaintsRepository = new FakeComplaintsRepository();

    service = new GetComplaintsByUserService(
      fakeUsersRepsoitory,
      fakeComplaintsRepository,
    );
  });

  it('Should not be able to get the complaints if user does not exists', async () => {
    await expect(
      service.execute({ user_id: 'invalid_id' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to get the complaints by user', async () => {
    const user = await fakeUsersRepsoitory.create(reporterMock);

    const complaints = await service.execute({ user_id: user.id });

    expect(complaints).toBeTruthy();
    expect(complaints).toBeInstanceOf(Array);
  });
});
