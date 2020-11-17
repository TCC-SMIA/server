import { v4 } from 'uuid';

import User from '@domains/users/infra/typeorm/entities/User';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import { UserTypes } from '@domains/users/enums/UserEnums';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async update(user: User): Promise<User> {
    const userIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[userIndex] = user;

    return this.users[userIndex];
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const userExists = this.users.find(user => user.email === email);

    return userExists;
  }

  public async findByNickname(nickname: string): Promise<User | undefined> {
    const userExists = this.users.find(user => user.nickname === nickname);

    return userExists;
  }

  public async findById(id: string): Promise<User | undefined> {
    const userExists = this.users.find(user => user.id === id);

    return userExists;
  }

  public async findByCnpj(cnpj: string): Promise<User | undefined> {
    const userExists = this.users.find(user => user.cnpj === cnpj);

    return userExists;
  }

  public async findEnvironmentalAgencyById(
    user_id: string,
  ): Promise<User | undefined> {
    const userExists = this.users.find(
      user =>
        user.id === user_id && user.type === UserTypes.EnvironmentalAgency,
    );

    return userExists;
  }

  public async create(userData: User): Promise<User> {
    const user = new User();

    Object.assign(user, { id: v4() }, userData);

    this.users.push(user);

    return user;
  }

  public async delete(user: User): Promise<void> {
    const userIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users.splice(userIndex);
  }
}

export default FakeUsersRepository;
