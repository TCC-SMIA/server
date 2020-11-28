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
  status?: string;
  type?: string;
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
    status,
    type,
  }: IRequest): Promise<Complaint[]> {
    const filters = {};

    if (state && state !== '0') Object.assign(filters, { state });
    if (city && city !== '0') Object.assign(filters, { city });
    if (type && type !== '0') Object.assign(filters, { type });
    if (status && status !== '0') Object.assign(filters, { status });

    const complaints = await this.complaintsRepository.findByFilters(
      skip,
      take,
      filters,
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
