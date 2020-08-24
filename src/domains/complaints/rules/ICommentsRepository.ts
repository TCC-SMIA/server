import Comment from '../infra/typeorm/entities/Comment';

export default interface ICommentsRepository {
  create(data: Partial<Comment>): Promise<Comment>;
  update(comment: Partial<Comment>): Promise<Comment>;
}
