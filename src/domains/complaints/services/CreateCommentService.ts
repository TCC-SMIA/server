import { inject, injectable } from 'tsyringe';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import ICommentsRepository from '../rules/ICommentsRepository';
import IComplaintsRepository from '../rules/IComplaintsRepository';
import Comment from '../infra/typeorm/entities/Comment';

interface CreateCommentRequest {
  user_id: string;
  complaint_id: string;
  content: string;
}

@injectable()
class CreateCommentService {
  constructor(
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,
  ) {}

  public async execute({
    user_id,
    complaint_id,
    content,
  }: CreateCommentRequest): Promise<Comment> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exist');
    }

    const complaint = await this.complaintsRepository.findById(complaint_id);

    if (!complaint) {
      throw new AppError('Complaint does not exist');
    }

    const comment = await this.commentsRepository.create(
      user,
      complaint,
      content,
    );

    return comment;
  }
}

export default CreateCommentService;
