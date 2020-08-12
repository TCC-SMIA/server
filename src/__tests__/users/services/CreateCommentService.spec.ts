import 'reflect-metadata';
import CreateCommentService from '@domains/complaints/services/CreateCommentService';
import ICommentsRepository from '@domains/complaints/rules/ICommentsRepository';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import FakeComplaintsRepository from '@tests/complaints/fakes/FakeComplaintsRepository';
import AppError from '@shared/errors/AppError';
import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import FakeNotificationsRepository from '@tests/notifications/fakes/FakeNotificationsRepository';
import FakeUsersRepository from '../fakes/FakeUsersRepository';
import FakeCommentsRepository from '../fakes/FakeCommentsRepository';

let commentRepository: ICommentsRepository;
let usersRepository: IUsersRepository;
let complaintRepository: IComplaintsRepository;
let createCommentService: CreateCommentService;
let notificationsRepository: INotificationsRepository;

describe('CreateCommentService', () => {
  beforeEach(() => {
    usersRepository = new FakeUsersRepository();
    complaintRepository = new FakeComplaintsRepository();
    commentRepository = new FakeCommentsRepository();
    notificationsRepository = new FakeNotificationsRepository();

    createCommentService = new CreateCommentService(
      commentRepository,
      usersRepository,
      complaintRepository,
      notificationsRepository,
    );
  });

  it('should be able to create a new comment', async () => {
    const user = await usersRepository.create({
      name: 'jhon',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    const complaint = await complaintRepository.create({
      title: 'Baleia encalhada',
      description:
        'Encontramos uma baleia encalhada na praia do forte, Cabo Frio',
      latitude: -22.88248,
      longitude: -42.0737652,
      anonymous: false,
      date: new Date(),
    });

    const date = new Date();

    const comment = await createCommentService.execute({
      user_id: user.id,
      complaint_id: complaint.id,
      content: 'New comment',
      date,
    });

    expect(comment).toBeTruthy();
    expect(comment.id).toBeTruthy();
    expect(comment.user.id).toBe(user.id);
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

    const date = new Date();

    await expect(
      createCommentService.execute({
        user_id: 'invalid_id',
        complaint_id: complaint.id,
        content: 'New comment',
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new comment without complaint', async () => {
    const user = await usersRepository.create({
      name: 'jhon',
      email: 'doe@doe.com',
      nickname: 'johnzins',
      password: '123123',
    });

    const date = new Date();

    await expect(
      createCommentService.execute({
        user_id: user.id,
        complaint_id: 'invalid_id',
        content: 'New comment',
        date,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
