import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  name: string;
  nickname: string;
  email: string;
  password: string;
}

class CreateUserService {
  private usersRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  constructor(usersRepository: IUsersRepository, hashProvider: IHashProvider) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  async execute({ name, nickname, email, password }: IRequest): Promise<User> {
    const checkEmailExists = await this.usersRepository.findByEmail(email);

    if (checkEmailExists) {
      throw new AppError('Email already exists');
    }

    const checkNicknameExists = await this.usersRepository.findByNickname(
      nickname,
    );

    if (checkNicknameExists) {
      throw new AppError('Nickname already used');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRepository.create({
      name,
      nickname,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;
