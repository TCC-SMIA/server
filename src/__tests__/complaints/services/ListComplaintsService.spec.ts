import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import ListComplaintsService from '@domains/complaints/services/ListComplaintsService';
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

    await fakeComplaintsRepository.create({
      user_id: 'valid_id',
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      latitude: -222222,
      longitude: 222222,
      anonymous: true,
      date,
    });

    await fakeComplaintsRepository.create({
      user_id: 'valid_id',
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      latitude: -222222,
      longitude: 222222,
      anonymous: false,
      date,
    });

    const listComplaints = await listComplaintsService.execute({
      skip: 0,
      take: 10,
    });

    expect(listComplaints).toHaveLength(2);
  });

  it('should be able to list the complaints by city', async () => {
    const date = new Date();

    await fakeComplaintsRepository.create({
      user_id: 'valid_id',
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      latitude: -222222,
      longitude: 222222,
      city: 'Arraial do Cabo',
      state: 'Rio de Janeiro',
      anonymous: true,
      date,
    });

    await fakeComplaintsRepository.create({
      user_id: 'valid_id',
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      latitude: -222222,
      longitude: 222222,
      city: 'Cabo Frio',
      state: 'Rio de Janeiro',
      anonymous: false,
      date,
    });

    const listComplaints = await listComplaintsService.execute({
      skip: 0,
      take: 10,
      city: 'Arraial do Cabo',
    });

    expect(listComplaints).toHaveLength(1);
  });
});
