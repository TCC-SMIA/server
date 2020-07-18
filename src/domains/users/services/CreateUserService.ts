import User from 'domains/users/infra/typeorm/entities/User';
import IUsersRepository from 'domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IHashProvider from 'domains/users/providers/HashProvider/rules/IHashProvider';
import UserTypes from '../enums/UserEnums';

interface IRequest {
  name: string;
  nickname: string;
  email: string;
  password: string;
  type: UserTypes.Admin | UserTypes.Reporter | UserTypes.EnvironmentalAgency;
}

class CreateUserService {
  private usersRepository: IUsersRepository;

  private hashProvider: IHashProvider;

  constructor(usersRepository: IUsersRepository, hashProvider: IHashProvider) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
  }

  async execute({
    name,
    nickname,
    email,
    password,
    type,
  }: IRequest): Promise<User> {
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
      type,
    });

    return user;
  }
}

export default CreateUserService;
