import { Repository, getRepository } from 'typeorm';

import ICommentsRepository from '../../../rules/ICommentsRepository';
import Comment from '../entities/Comment';

class CommentsRepository implements ICommentsRepository {
  private commentRepository: Repository<Comment>;

  constructor() {
    this.commentRepository = getRepository(Comment);
  }

  public async create(comment: Partial<Comment>): Promise<Comment> {
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

  public async findByComplaintId(complaint_id: string): Promise<Comment[]> {
    const listComments = await this.commentRepository.find({
      where: { complaint_id },
    });

    return listComments;
  }
}

export default CommentsRepository;
