import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';

import Complaint from '../infra/typeorm/entities/Complaint';
import IComplaintsRepository from '../rules/IComplaintsRepository';

interface IRequest {
  user_id: string;
  title: string;
  description: string;
}

@injectable()
class CreateComplaintService {
  constructor(
    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,
  ) {}

  public async execute({
    user_id,
    title,
    description,
  }: IRequest): Promise<Complaint> {
    const complaint = await this.complaintsRepository.create({
      user_id,
      title,
      description,
    });

    return complaint;
  }
}

export default CreateComplaintService;
