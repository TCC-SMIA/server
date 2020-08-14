import User from '@domains/users/infra/typeorm/entities/User';
import Comment from '../infra/typeorm/entities/Comment';
import Complaint from '../infra/typeorm/entities/Complaint';

export default interface ICommentsRepository {
  create(
    user: User,
    complaint: Complaint,
    content: string,
    date: Date,
  ): Promise<Comment>;
  update(comment: Partial<Comment>): Promise<Comment>;
}
