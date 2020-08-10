import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import IComplaintsRepository from '../rules/IComplaintsRepository';
import Complaint from '../infra/typeorm/entities/Complaint';

interface IRequest {
  skip: number;
  take: number;
}

@injectable()
class ListComplaintsService {
  constructor(
    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,
  ) {}

  public async execute({ skip, take }: IRequest): Promise<Complaint[]> {
    const complaints = await this.complaintsRepository.findAllComplaints(
      skip,
      take,
    );

    return complaints;
  }
}

export default ListComplaintsService;
