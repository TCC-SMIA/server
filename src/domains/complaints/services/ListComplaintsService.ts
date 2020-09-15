import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import IComplaintsRepository from '../rules/IComplaintsRepository';
import Complaint from '../infra/typeorm/entities/Complaint';

interface IRequest {
  skip: number;
  take: number;
  city?: string;
}

@injectable()
class ListComplaintsService {
  constructor(
    @inject('ComplaintsRepository')
    private complaintsRepository: IComplaintsRepository,
  ) {}

  public async execute({ skip, take, city }: IRequest): Promise<Complaint[]> {
    console.log(city);

    if (city) {
      const complaints = await this.complaintsRepository.findByCity(
        skip,
        take,
        city,
      );

      const filteredComplaints = complaints.map(complaint => {
        if (complaint.anonymous) {
          delete complaint.user;
          delete complaint.user_id;
        }
        return complaint;
      });

      console.log('WITH CITY', filteredComplaints);
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

    console.log('WITHOUT CITY', filteredComplaints);
    return filteredComplaints;
  }
}

export default ListComplaintsService;
