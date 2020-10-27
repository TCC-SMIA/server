import 'reflect-metadata';

import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import GetComplaintService from '@domains/complaints/services/GetComplaintService';
import Complaint from '@domains/complaints/infra/typeorm/entities/Complaint';
import AppError from '@shared/errors/AppError';
import FakeComplaintsRepository from '../fakes/FakeComplaintsRepository';

let fakeComplaintsRepository: IComplaintsRepository;
let getComplaintService: GetComplaintService;

describe('GetComplaintService', () => {
  beforeEach(() => {
    fakeComplaintsRepository = new FakeComplaintsRepository();
    getComplaintService = new GetComplaintService(fakeComplaintsRepository);
  });

  it('Should be able to return a complaint', async () => {
    jest
      .spyOn(fakeComplaintsRepository, 'findById')
      .mockReturnValueOnce(Promise.resolve({ id: 'valid_id' } as Complaint));

    const complaint = await getComplaintService.execute({
      complaint_id: 'valid_id',
    });

    expect(complaint).toBeTruthy();
    expect(complaint.id).toBeTruthy();
  });

  it('Should not be able to return a complaint if complaint does not exists', async () => {
    await expect(
      getComplaintService.execute({
        complaint_id: 'valid_id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
