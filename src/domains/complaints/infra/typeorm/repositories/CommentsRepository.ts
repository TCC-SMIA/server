import { Repository, getRepository } from 'typeorm';
import ICommentsRepository from '../../../rules/ICommentsRepository';

import Comment from '../entities/Comment';

class CommentsRepository implements ICommentsRepository {
  private commentRepository: Repository<Comment>;

  constructor() {
    this.commentRepository = getRepository(Comment);
  }

  public async create(commentData: Partial<Comment>): Promise<Comment> {
    const comment = new Comment();

    Object.assign(comment, commentData);
    const createdComment = this.commentRepository.create(commentData);

    const storedComment = await this.commentRepository.save(createdComment);

    return storedComment;
  }

  public async update(commentData: Partial<Comment>): Promise<Comment> {
    const comment = new Comment();

    Object.assign(comment, commentData);

    return this.commentRepository.save(comment);
  }
}

export default CommentsRepository;
