import Comment from '../infra/typeorm/entities/Comment';

export default interface ICommentsRepository {
  create(complaintData: Partial<Comment>): Promise<Comment>;
  update(complaint: Partial<Comment>): Promise<Comment>;
}
