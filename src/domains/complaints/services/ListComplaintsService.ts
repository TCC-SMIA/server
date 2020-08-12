import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import { classToClass } from 'class-transformer';
import User from '@domains/users/infra/typeorm/entities/User';
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

    const filteredComplaints = complaints.map(complaint => {
      if (complaint.anonymous) {
        const complaintItem = complaint;
        delete complaintItem.user;
        delete complaintItem.user_id;
        return complaintItem;
      }
      return complaint;
    });

    return filteredComplaints;
  }
}

export default ListComplaintsService;
