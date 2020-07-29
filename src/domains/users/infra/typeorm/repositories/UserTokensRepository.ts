import { Repository, getRepository } from 'typeorm';

import UserToken from '@domains/users/infra/typeorm/entities/UserToken';
import IUserTokensRepository from '@domains/users/rules/IUserTokensRepository';

class UserTokensRepository implements IUserTokensRepository {
  private userTokensRepository: Repository<UserToken>;

  constructor() {
    this.userTokensRepository = getRepository(UserToken);
  }

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.userTokensRepository.create({
      user_id,
    });

    await this.userTokensRepository.save(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.userTokensRepository.findOne({
      where: { token },
    });

    return userToken;
  }
}

export default UserTokensRepository;
