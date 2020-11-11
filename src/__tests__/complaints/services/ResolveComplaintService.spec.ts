import 'reflect-metadata';

import ResolveComplaintService from '@domains/complaints/services/ResolveComplaintService';
import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import AppError from '@shared/errors/AppError';
import User from '@domains/users/infra/typeorm/entities/User';
import { ComplaintStatusEnum } from '@domains/complaints/enums/ComplaintStatusEnum';
import FakeComplaintsRepository from '../fakes/FakeComplaintsRepository';

let fakeComplaintRepository: IComplaintsRepository;
let service: ResolveComplaintService;

describe('ResolveComplaintService', () => {
  beforeAll(() => {
    fakeComplaintRepository = new FakeComplaintsRepository();
    service = new ResolveComplaintService(fakeComplaintRepository);
  });

  it('Should be able to resolve a complaint', async () => {
    await fakeComplaintRepository.create({
      id: 'valid_id',
      status: ComplaintStatusEnum.Resolved,
      user: { id: 'valid_user_id' } as User,
    });

    const resolvedComplaint = await service.execute({
      complaint_id: 'valid_id',
      user_id: 'valid_user_id',
    });

    expect(resolvedComplaint).toBeTruthy();
    expect(resolvedComplaint.id).toBeTruthy();
    expect(resolvedComplaint.status).toBeTruthy();
  });

  it('Should not be able to update a unexistent complaint', async () => {
    await fakeComplaintRepository.create({
      id: 'valid_id',
      user: { id: 'valid_user_id' } as User,
    });

    await expect(
      service.execute({
        complaint_id: 'invalid_id',
        user_id: 'valid_user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to update a the complaint with a invalid user', async () => {
    await fakeComplaintRepository.create({
      id: 'valid_id',
      user: { id: 'valid_user_id' } as User,
    });

    await expect(
      service.execute({
        complaint_id: 'valid_id',
        user_id: 'invalid_user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
