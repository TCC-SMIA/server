import 'reflect-metadata';
import CreateCommentService from '@domains/complaints/services/CreateCommentService';
import ICommentsRepository from '@domains/complaints/rules/ICommentsRepository';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import FakeComplaintsRepository from '@tests/complaints/fakes/FakeComplaintsRepository';
import AppError from '@shared/errors/AppError';
import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import FakeNotificationsRepository from '@tests/notifications/fakes/FakeNotificationsRepository';
import CreateNotificationService from '@domains/notifications/services/CreateNotificationService';
import FakeUsersRepository from '@tests/users/fakes/FakeUsersRepository';
import FakeCommentsRepository from '@tests/complaints/fakes/FakeCommentsRepository';
import {
  environmentalAgencyMock,
  reporterMock,
} from '@tests/__mocks__/User.mock';

let commentRepository: ICommentsRepository;
let fakeUsersRepository: IUsersRepository;
let complaintRepository: IComplaintsRepository;
let createCommentService: CreateCommentService;
let notificationsRepository: INotificationsRepository;
let createNotificationService: CreateNotificationService;

describe('CreateCommentService', () => {
  beforeAll(() => {
    fakeUsersRepository = new FakeUsersRepository();
    complaintRepository = new FakeComplaintsRepository();
    commentRepository = new FakeCommentsRepository();
    notificationsRepository = new FakeNotificationsRepository();
    createNotificationService = new CreateNotificationService(
      notificationsRepository,
    );
    createCommentService = new CreateCommentService(
      commentRepository,
      fakeUsersRepository,
      complaintRepository,
      createNotificationService,
    );
  });

  it('should be able to create a new comment by user', async () => {
    const user = await fakeUsersRepository.create(reporterMock);

    const complaint = await complaintRepository.create({
      title: 'Baleia encalhada',
      description:
        'Encontramos uma baleia encalhada na praia do forte, Cabo Frio',
      latitude: -22.88248,
      longitude: -42.0737652,
      anonymous: false,
      date: new Date(),
      user,
      user_id: user.id,
    });

    const comment = await createCommentService.execute({
      user_id: user.id,
      complaint_id: complaint.id,
      content: 'New comment',
    });

    expect(comment).toBeTruthy();
    expect(comment.id).toBeTruthy();
    expect(comment.user.id).toBe(user.id);
    expect(comment.complaint.id).toBe(complaint.id);
    expect(comment.content).toBe('New comment');
  });

  it('should be able to create a new comment by agency', async () => {
    const agency = await fakeUsersRepository.create(environmentalAgencyMock);

    const complaint = await complaintRepository.create({
      title: 'Baleia encalhada',
      description:
        'Encontramos uma baleia encalhada na praia do forte, Cabo Frio',
      latitude: -22.88248,
      longitude: -42.0737652,
      anonymous: false,
      date: new Date(),
    });

    const comment = await createCommentService.execute({
      user_id: agency.id,
      complaint_id: complaint.id,
      content: 'New comment',
    });

    expect(comment).toBeTruthy();
    expect(comment.id).toBeTruthy();
    expect(comment.complaint.id).toBe(complaint.id);
    expect(comment.content).toBe('New comment');
  });

  it('should not be able to create a new comment with a non existing user', async () => {
    const complaint = await complaintRepository.create({
      title: 'Baleia encalhada',
      description:
        'Encontramos uma baleia encalhada na praia do forte, Cabo Frio',
      latitude: -22.88248,
      longitude: -42.0737652,
      anonymous: false,
      date: new Date(),
    });

    await expect(
      createCommentService.execute({
        user_id: 'invalid_id',
        complaint_id: complaint.id,
        content: 'New comment',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new comment without complaint', async () => {
    const user = await fakeUsersRepository.create(reporterMock);

    await expect(
      createCommentService.execute({
        user_id: user.id,
        complaint_id: 'invalid_id',
        content: 'New comment',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
