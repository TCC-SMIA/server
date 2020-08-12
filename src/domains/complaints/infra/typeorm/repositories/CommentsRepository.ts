import { Repository, getRepository } from 'typeorm';
import User from '@domains/users/infra/typeorm/entities/User';
import ICommentsRepository from '../../../rules/ICommentsRepository';

import Comment from '../entities/Comment';
import Complaint from '../entities/Complaint';

class CommentsRepository implements ICommentsRepository {
  private commentRepository: Repository<Comment>;

  constructor() {
    this.commentRepository = getRepository(Comment);
  }

  public async create(
    user: User,
    complaint: Complaint,
    content: string,
    date: Date,
  ): Promise<Comment> {
    const comment = new Comment();

    Object.assign(comment, { content, user, complaint, date });
    const createdComment = this.commentRepository.create(comment);

    const storedComment = await this.commentRepository.save(createdComment);

    return storedComment;
  }

  public async update(commentData: Partial<Comment>): Promise<Comment> {
    const comment = new Comment();

    Object.assign(comment, commentData);

    const storedComment = await this.commentRepository.save(comment);

    return storedComment;
  }
}

export default CommentsRepository;
