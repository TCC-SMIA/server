import { Repository, getRepository } from 'typeorm';

import ICreateUserDTO from 'domains/users/dtos/ICreateUserDTO';
import IUsersRepository from 'domains/users/rules/IUsersRepository';
import User from 'domains/users/infra/typeorm/entities/User';

class UsersRepository implements IUsersRepository {
  private usersRepository: Repository<User>;

  constructor() {
    this.usersRepository = getRepository(User);
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.usersRepository.create(userData);

    await this.usersRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { email } });

    return user;
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { id } });

    return user;
  }

  public async findByNickname(nickname: string): Promise<User | undefined> {
    const user = await this.usersRepository.findOne({ where: { nickname } });

    return user;
  }
}

export default UsersRepository;
