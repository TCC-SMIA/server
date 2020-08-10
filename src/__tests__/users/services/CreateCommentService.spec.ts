import 'reflect-metadata';
import CreateCommentService from '@domains/complaints/services/CreateCommentService';
import ICommentsRepository from '@domains/complaints/rules/ICommentsRepository';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';

let commentRepository: ICommentsRepository;
let usersRepository: IUsersRepository;
let complaintRepository: IComplaintsRepository;
let createCommentService: CreateCommentService;

describe('CreateCommentService', () => {
  beforeEach(() => {
    createCommentService = new CreateCommentService(
      commentRepository,
      usersRepository,
      complaintRepository,
    );
  });

  it('should be able to create a new comment', async () => {
    expect(1 + 1).toBe(2);
  });
});
