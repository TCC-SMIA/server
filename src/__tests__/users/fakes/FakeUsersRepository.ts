import User from 'domains/users/infra/typeorm/entities/User';
import IUsersRepository from 'domains/users/rules/IUsersRepository';

class FakeUsersRepository implements IUsersRepository {
  save(user: User): Promise<User> {
    throw new Error('Method not implemented.');
  }

  findByEmail(email: string): Promise<User | undefined> {
    throw new Error('Method not implemented.');
  }

  findByNickname(nickname: string): Promise<User | undefined> {
    throw new Error('Method not implemented.');
  }

  findById(id: string): Promise<User | undefined> {
    throw new Error('Method not implemented.');
  }

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
