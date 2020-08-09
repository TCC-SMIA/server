import ICommentsRepository from '@domains/complaints/rules/ICommentsRepository';
import User from '@domains/users/infra/typeorm/entities/User';
import Complaint from '@domains/complaints/infra/typeorm/entities/Complaint';
import { v4 } from 'uuid';
import Comment from '@domains/complaints/infra/typeorm/entities/Comment';

class FakeCommentsRepository implements ICommentsRepository {
  private readonly comments: Comment[] = [];

  public async create(
    user: User,
    complaint: Complaint,
    content: string,
  ): Promise<Comment> {
    const comment = new Comment();

    Object.assign(comment, { content, user, complaint });

    comment.id = v4();

    this.comments.push(comment);

    return comment;
  }

  public async update(comment: Partial<Comment>): Promise<Comment> {
    const commentIndex = this.comments.findIndex(
      storedComment => storedComment.id === comment.id,
    );

    const commentToSave = new Comment();

    Object.assign(commentToSave, comment);

    this.comments[commentIndex] = commentToSave;

    return this.comments[commentIndex];
  }
}

export default FakeCommentsRepository;
