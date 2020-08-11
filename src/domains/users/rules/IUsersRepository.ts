import ICreateUserDTO from 'domains/users/dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUsersRepository {
  create(userData: ICreateUserDTO): Promise<User>;
  update(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findByNickname(nickname: string): Promise<User | undefined>;
  findById(id: string): Promise<User | undefined>;
  delete(user: User): Promise<void>;
}
