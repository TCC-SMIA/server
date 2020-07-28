import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import CreateComplaintService from '@domains/complaints/services/CreateComplaintService';
import FakeComplaintsRepository from '../fakes/FakeComplaintsRepository';

let fakeComplaintsRepository: IComplaintsRepository;
let createComplaintService: CreateComplaintService;

describe('CreateComplaintService', () => {
  beforeEach(() => {
    fakeComplaintsRepository = new FakeComplaintsRepository();
    createComplaintService = new CreateComplaintService(
      fakeComplaintsRepository,
    );
  });

  it('should be able to create a complaint', async () => {
    const complaint = await createComplaintService.execute({
      user_id: 'anyuserid',
      title: 'test complaint created',
      description: 'description of complaint created',
    });

    expect(complaint.title).toBe('test complaint created');
  });
});
