import IUsersRepository from 'domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  nickname: string;
  email: string;
}

class CreateUserValidator {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  public async checkUserExists({ nickname, email }: IRequest): Promise<void> {
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
  }
}

export default CreateUserValidator;
