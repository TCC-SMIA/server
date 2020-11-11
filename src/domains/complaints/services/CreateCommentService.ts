import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import CreateNotificationService from '@domains/notifications/services/CreateNotificationService';
import { UserTypes } from '@domains/users/enums/UserEnums';
import IAgencyRepository from '@domains/users/rules/IAgencyRepository';
import User from '@domains/users/infra/typeorm/entities/User';
import Agency from '@domains/users/infra/typeorm/entities/Agency';
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

    @inject('AgencyRepository')
    private agencyRepository: IAgencyRepository,

    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,

    @inject('CreateNotificationService')
    private createNotificationService: CreateNotificationService,
  ) {}

  public async execute({
    user_id,
    complaint_id,
    content,
  }: CreateCommentRequest): Promise<Comment> {
    let user: User | Agency | undefined;
    let user_type = 0;

    if (!content) throw new AppError('You can not create an empty message');

    user = await this.usersRepository.findById(user_id);

    if (!user) {
      user = await this.agencyRepository.findById(user_id);
      if (!user) {
        throw new AppError('User not found');
      } else {
        user_type = UserTypes.EnvironmentalAgency;
      }
    } else {
      user_type = UserTypes.Reporter;
    }

    const complaint = await this.complaintsRepository.findById(complaint_id);

    if (!complaint) {
      throw new AppError('Complaint does not exist');
    }

    const today = new Date();

    let comment = new Comment();

    if (user_type === UserTypes.Reporter) {
      comment = await this.commentsRepository.create({
        user_id: user.id,
        user: user as User,
        agency_id: undefined,
        agency: undefined,
        complaint,
        content,
        date: today,
      });
    }

    if (user_type === UserTypes.EnvironmentalAgency) {
      comment = await this.commentsRepository.create({
        user_id: undefined,
        user: undefined,
        agency_id: user.id,
        agency: user as Agency,
        complaint,
        content,
        date: today,
      });
    }

    await this.createNotificationService.execute({
      user_id: complaint.user_id,
      content: `Novo comentário de ${user.name} na sua publicação.`,
    });

    return classToClass(comment);
  }
}

export default CreateCommentService;
