import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import User from '@domains/users/infra/typeorm/entities/User';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IHashProvider from '../providers/HashProvider/rules/IHashProvider';
import Agency from '../infra/typeorm/entities/Agency';
import IAgencyRepository from '../rules/IAgencyRepository';
import { UserTypes } from '../enums/UserEnums';

interface IRequest {
  user_id: string;
  name: string;
  nickname?: string;
  email: string;
  oldpassword?: string;
  password?: string;
  password_confirmation?: string;
}

interface IResponse {
  user: Agency | User;
  user_type: number;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AgencyRepository')
    private agencyRepository: IAgencyRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async execute({
    user_id,
    name,
    nickname,
    email,
    oldpassword,
    password,
    password_confirmation,
  }: IRequest): Promise<IResponse> {
    let user: User | Agency | undefined;
    let user_type = 0;

    user = await this.usersRepository.findById(user_id);

    if (!user) {
      user = await this.agencyRepository.findById(user_id);
      if (!user) {
        throw new AppError('User not found');
      } else {
        user_type = UserTypes.EnvironmentalAgency;
      }
    } else {
      user_type = UserTypes.Reporter;
    }

    let checkNickNameExists: User | undefined;
    if (nickname) {
      checkNickNameExists = await this.usersRepository.findByNickname(nickname);
      if (checkNickNameExists && checkNickNameExists.id !== user_id) {
        throw new AppError('Nickname already used');
      }
      if (user instanceof User) {
        user.nickname = nickname;
      }
    }

    const checkEmailExists = await this.usersRepository.findByEmail(email);

    if (checkEmailExists && checkEmailExists.id !== user_id) {
      throw new AppError('Email already used');
    }

    user.name = name;
    user.email = email;

    if (password && !oldpassword) {
      throw new AppError(
        'To update password is necessary to confirm the old password.',
      );
    }
    if (password && oldpassword) {
      const passwordMatched = await this.hashProvider.compareHash(
        oldpassword,
        user.password,
      );

      if (!passwordMatched) {
        throw new AppError('Old password is wrong.');
      }

      if (password !== password_confirmation) {
        throw new AppError(
          'Password and password_confirmation must be the same',
        );
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    if (user_type === UserTypes.Reporter) {
      await this.usersRepository.update(user as User);
    }

    if (user_type === UserTypes.EnvironmentalAgency) {
      await this.agencyRepository.update(user as Agency);
    }

    return { user, user_type };
  }
}

export default UpdateProfileService;
