import { v4 } from 'uuid';

import ICommentsRepository from '@domains/complaints/rules/ICommentsRepository';
import Comment from '@domains/complaints/infra/typeorm/entities/Comment';

class FakeCommentsRepository implements ICommentsRepository {
  private readonly comments: Comment[] = [];

  public async create(data: Partial<Comment>): Promise<Comment> {
    const comment = new Comment();

    Object.assign(comment, data);

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

  public async findByComplaintId(complaint_id: string): Promise<Comment[]> {
    const comments = this.comments.filter(comment => {
      return comment.complaint_id === complaint_id;
    });

    return comments;
  }
}

export default FakeCommentsRepository;
