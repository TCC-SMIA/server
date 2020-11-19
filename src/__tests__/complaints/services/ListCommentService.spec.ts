import 'reflect-metadata';
import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import ListCommentsService from '@domains/complaints/services/ListCommentsService';
import ICommentsRepository from '@domains/complaints/rules/ICommentsRepository';
import FakeCommentsRepository from '@tests/complaints/fakes/FakeCommentsRepository';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import FakeUsersRepository from '@tests/users/fakes/FakeUsersRepository';
import { environmentalAgencyMock } from '@tests/__mocks__/User.mock';
import FakeComplaintsRepository from '../fakes/FakeComplaintsRepository';

let fakeComplaintsRepository: IComplaintsRepository;
let fakeCommentsRepository: ICommentsRepository;
let fakeAgencysRepository: IUsersRepository;
let listCommentsService: ListCommentsService;

describe('ListCommentService', () => {
  beforeEach(() => {
    fakeComplaintsRepository = new FakeComplaintsRepository();
    fakeCommentsRepository = new FakeCommentsRepository();
    fakeAgencysRepository = new FakeUsersRepository();
    listCommentsService = new ListCommentsService(
      fakeComplaintsRepository,
      fakeCommentsRepository,
    );
  });

  it('should be able to list the comments created', async () => {
    await fakeAgencysRepository.create(environmentalAgencyMock);

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
