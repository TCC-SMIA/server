import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IHashProvider from '@domains/users/providers/HashProvider/rules/IHashProvider';
import AppError from '@shared/errors/AppError';
import User from '@domains/users/infra/typeorm/entities/User';

interface IRequest {
  email?: string;
  nickname?: string;
  password: string;
}

class CreateSessionValidator {
  private usersRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  constructor(usersRepository: IUsersRepository, hashProvider: IHashProvider) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  public async checkUserCredentials({
    email,
    nickname,
    password,
  }: IRequest): Promise<User> {
    let user: User | undefined;
    if (email) {
      user = await this.usersRepository.findByEmail(email);
    }
    if (nickname) {
      user = await this.usersRepository.findByNickname(nickname);
    }
    if (!user) {
      throw new AppError('User was not found.');
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect combination for login');
    }

    return user;
  }
}

export default CreateSessionValidator;
