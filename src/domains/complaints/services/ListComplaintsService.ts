import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';
import { classToClass } from 'class-transformer';

import IComplaintsRepository from '../rules/IComplaintsRepository';
import Complaint from '../infra/typeorm/entities/Complaint';

interface IRequest {
  skip: number;
  take: number;
  city?: string;
  state?: string;
}

@injectable()
class ListComplaintsService {
  constructor(
    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,
  ) {}

  public async execute({
    skip,
    take,
    city,
    state,
  }: IRequest): Promise<Complaint[]> {
    if (city && state) {
      const complaints = await this.complaintsRepository.findByCity(
        skip,
        take,
        city,
        state,
      );

      const filteredComplaints = complaints.map(complaint => {
        if (complaint.anonymous) {
          delete complaint.user;
          delete complaint.user_id;
        }
        return complaint;
      });

      return filteredComplaints;
    }

    if (state) {
      const complaints = await this.complaintsRepository.findByState(
        skip,
        take,
        state,
      );

      const filteredComplaints = complaints.map(complaint => {
        if (complaint.anonymous) {
          delete complaint.user;
          delete complaint.user_id;
        }
        return complaint;
      });

      return filteredComplaints;
    }

    const complaints = await this.complaintsRepository.findAllComplaints(
      skip,
      take,
    );

    const filteredComplaints = complaints.map(complaint => {
      if (complaint.anonymous) {
        delete complaint.user;
        delete complaint.user_id;
      }
      return complaint;
    });

    return classToClass(filteredComplaints);
  }
}

export default ListComplaintsService;
