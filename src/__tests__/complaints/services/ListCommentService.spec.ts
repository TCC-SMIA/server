import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import ListCommentsService from '@domains/complaints/services/ListCommentsService';
import Complaint from '@domains/complaints/infra/typeorm/entities/Complaint';
import ICommentsRepository from '@domains/complaints/rules/ICommentsRepository';
import FakeCommentsRepository from '@tests/users/fakes/FakeCommentsRepository';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import FakeAgencyRepository from '@tests/users/fakes/FakeAgencyRepository';
import AppError from '@shared/errors/AppError';
import FakeComplaintsRepository from '../fakes/FakeComplaintsRepository';

let fakeComplaintsRepository: IComplaintsRepository;
let fakeCommentsRepository: ICommentsRepository;
let fakeAgencysRepository: IAgencyRepository;
let listCommentsService: ListCommentsService;

describe('ListCommentService', () => {
  beforeEach(() => {
    fakeComplaintsRepository = new FakeComplaintsRepository();
    fakeCommentsRepository = new FakeCommentsRepository();
    fakeAgencysRepository = new FakeAgencyRepository();
    listCommentsService = new ListCommentsService(
      fakeComplaintsRepository,
      fakeCommentsRepository,
    );
  });

  it('should be able to list the comments created', async () => {
    const agency = await fakeAgencysRepository.create({
      name: 'Valid Agency Name',
      cnpj: '60603851000150',
      email: 'validemail@email.com',
      password: '123456,',
    });

    const complaint = await fakeComplaintsRepository.create({
      title: 'Baleia encalhada',
      description:
        'Encontramos uma baleia encalhada na praia do forte, Cabo Frio',
      latitude: -22.88248,
      longitude: -42.0737652,
      anonymous: false,
      date: new Date(),
    });

    const date = new Date();

    const comment = await fakeCommentsRepository.create({
      complaint_id: complaint.id,
      content: 'New comment',
      agency,
      agency_id: agency.id,
      complaint,
      date,
    });

    const listComments = await listCommentsService.execute({
      complaint_id: complaint.id,
    });

    expect(listComments).toHaveLength(1);
    expect(listComments[0].id).toBe(comment.id);
    expect(listComments[0].content).toBe('New comment');
    expect(listComments[0].complaint_id).toBe(complaint.id);
  });

  it('should not be able to list comments without complaint', async () => {
    await expect(
      listCommentsService.execute({
        complaint_id: 'InvalidId',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
