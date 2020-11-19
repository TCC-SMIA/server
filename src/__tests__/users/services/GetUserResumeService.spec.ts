import 'reflect-metadata';

import { ComplaintStatusEnum } from '@domains/complaints/enums/ComplaintStatusEnum';
import Complaint from '@domains/complaints/infra/typeorm/entities/Complaint';
import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import GetUserResumeService from '@domains/users/services/GetUserResumeService';
import AppError from '@shared/errors/AppError';
import FakeComplaintsRepository from '@tests/complaints/fakes/FakeComplaintsRepository';
import { reporterMock } from '@tests/__mocks__/User.mock';
import FakeUsersRepository from '../fakes/FakeUsersRepository';

let fakeUsersRepository: IUsersRepository;
let fakeComplaintsRepository: IComplaintsRepository;
let service: GetUserResumeService;

describe('GetUserResumeService', () => {
  beforeAll(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeComplaintsRepository = new FakeComplaintsRepository();
    service = new GetUserResumeService(
      fakeUsersRepository,
      fakeComplaintsRepository,
    );
  });

  it('Should be able to return the resume of user activity', async () => {
    const user = await fakeUsersRepository.create(reporterMock);

    const resume = await service.execute({ user_id: user.id });

    expect(resume).toBeTruthy();
    expect(resume).toHaveProperty('complaints_in_progress');
    expect(resume).toHaveProperty('complaints_reported');
    expect(resume).toHaveProperty('complaints_resolved');
    expect(resume.user.id).toBe(user.id);
  });

  it('Should be able to return the resume of user activity', async () => {
    const user = await fakeUsersRepository.create(reporterMock);

    await fakeComplaintsRepository.create({
      user_id: user.id,
      user,
      status: ComplaintStatusEnum.InProgress,
    });
    await fakeComplaintsRepository.create({
      user_id: user.id,
      user,
      status: ComplaintStatusEnum.InProgress,
    });
    await fakeComplaintsRepository.create({
      user_id: user.id,
      user,
      status: ComplaintStatusEnum.Resolved,
    });

    const resume = await service.execute({ user_id: user.id });

    expect(resume).toBeTruthy();
    expect(resume).toHaveProperty('complaints_in_progress');
    expect(resume).toHaveProperty('complaints_reported');
    expect(resume).toHaveProperty('complaints_resolved');
    expect(resume.user.id).toBe(user.id);
    expect(resume.complaints_in_progress).toBe(2);
    expect(resume.complaints_resolved).toBe(1);
  });

  it('Should not be able to return the resume if user does not exists', async () => {
    await expect(
      service.execute({ user_id: 'invalid_id' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
