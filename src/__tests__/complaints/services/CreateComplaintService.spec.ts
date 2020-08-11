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
    const date = new Date();
    const complaint = await createComplaintService.execute({
      user_id: 'anyuserid',
      title: 'test complaint created',
      description: 'description of complaint created',
      latitude: -222222,
      longitude: 222222,
      anonymous: false,
      date,
    });

    expect(complaint).toBeTruthy();
    expect(complaint.id).toBeTruthy();
    expect(complaint.title).toBe('test complaint created');
    expect(complaint.description).toBe('description of complaint created');
    expect(complaint.latitude).toBe(-222222);
    expect(complaint.longitude).toBe(222222);
    expect(complaint.anonymous).toBe(false);
    expect(complaint.date).toBe(date);
  });

  it('should be able to create a anonymous complaint', async () => {
    const createMock = jest.spyOn(fakeComplaintsRepository, 'create');

    const date = new Date();

    const complaint = await createComplaintService.execute({
      user_id: 'valid_id',
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      latitude: -222222,
      longitude: 222222,
      anonymous: true,
      date,
    });

    expect(complaint).toBeTruthy();
    expect(complaint.id).toBeTruthy();
    expect(complaint.title).toBe('New anonynmous Complaint');
    expect(complaint.description).toBe('We found a new planet');
    expect(complaint.latitude).toBe(-222222);
    expect(complaint.longitude).toBe(222222);
    expect(complaint.date).toEqual(date);
    expect(createMock).toHaveBeenCalledWith({
      user_id: 'valid_id',
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      latitude: -222222,
      longitude: 222222,
      anonymous: true,
      date,
    });
  });
});
