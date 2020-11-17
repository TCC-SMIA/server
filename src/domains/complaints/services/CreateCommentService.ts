import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import CreateNotificationService from '@domains/notifications/services/CreateNotificationService';
import User from '@domains/users/infra/typeorm/entities/User';
import SocketChannels from '@shared/websocket/socket-channels';
import * as socket from '@shared/websocket/websocket';
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

    @inject('CreateNotificationService')
    private createNotificationService: CreateNotificationService,
  ) {}

  public async execute({
    user_id,
    complaint_id,
    content,
  }: CreateCommentRequest): Promise<Comment> {
    if (!content) throw new AppError('You can not create an empty message');

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found');
    }

    const complaint = await this.complaintsRepository.findById(complaint_id);

    if (!complaint) {
      throw new AppError('Complaint does not exist');
    }

    const today = new Date();

    const comment = await this.commentsRepository.create({
      user_id: user.id,
      user: user as User,
      agency_id: undefined,
      complaint,
      content,
      date: today,
    });

    if (user_id !== complaint.user_id)
      await this.createNotificationService.execute({
        user_id: complaint.user_id,
        content: `Novo comentário de ${user.name} na sua publicação.`,
      });

    const comments = await this.commentsRepository.findByComplaintId(
      complaint.id,
    );

    const sendTo = socket.findConnections(user.id);

    socket.sendMessage(
      sendTo,
      SocketChannels.ComplaintCommentsChannel,
      comments,
    );

    return classToClass(comment);
  }
}

export default CreateCommentService;
