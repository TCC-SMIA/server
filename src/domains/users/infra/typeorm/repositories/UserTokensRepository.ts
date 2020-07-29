import { Repository, getRepository } from 'typeorm';

import UserToken from '@domains/users/infra/typeorm/entities/UserToken';
import IUserTokensRepository from '@domains/users/rules/IUserTokensRepository';

class UserTokensRepository implements IUserTokensRepository {
  private userTokensRepository: Repository<UserToken>;

  constructor() {
    this.userTokensRepository = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {}

  public async findByToken(token: string): Promise<UserToken | undefined> {}
}

export default UserTokensRepository;
