import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import IComplaintsRepository from '../rules/IComplaintsRepository';
import Complaint from '../infra/typeorm/entities/Complaint';

interface IRequest {
  user_id: string;
}

@injectable()
class ListComplaintsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<Complaint[]> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) throw new AppError('User was not found');

    const complaints = await this.complaintsRepository.findAllByUserId(user.id);

    return classToClass(complaints);
  }
}

export default ListComplaintsService;
