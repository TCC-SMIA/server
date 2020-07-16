import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
  create(): Promise<User>;
}
