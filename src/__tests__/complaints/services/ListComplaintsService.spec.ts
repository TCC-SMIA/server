import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import ListComplaintsService from '@domains/complaints/services/ListComplaintsService';
import Complaint from '@domains/complaints/infra/typeorm/entities/Complaint';
import FakeComplaintsRepository from '../fakes/FakeComplaintsRepository';

let fakeComplaintsRepository: IComplaintsRepository;
let listComplaintsService: ListComplaintsService;

describe('ListComplaintsService', () => {
  beforeEach(() => {
    fakeComplaintsRepository = new FakeComplaintsRepository();
    listComplaintsService = new ListComplaintsService(fakeComplaintsRepository);
  });

  it('should be able to list the complaints created', async () => {
    const date = new Date();

    const complaint = await fakeComplaintsRepository.create({
      user_id: 'valid_id',
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      latitude: -222222,
      longitude: 222222,
      anonymous: true,
      date,
    });

    const listComplaints = await listComplaintsService.execute({
      skip: 0,
      take: 10,
    });

    expect(listComplaints).toHaveLength(1);
  });
});
