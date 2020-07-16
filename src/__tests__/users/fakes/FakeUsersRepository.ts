import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/rules/IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  users: User[] = [];

  async create(): Promise<User> {
    const name = 'aaa';
    const user = new User();

    Object.assign(user, { name });

    this.users.push(user);

    return user;
  }
}

export default FakeUsersRepository;
