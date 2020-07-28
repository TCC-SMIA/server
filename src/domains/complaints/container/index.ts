import { container } from 'tsyringe';
import IComplaintsRepository from '../rules/IComplaintsRepository';
import ComplaintsRepository from '../infra/typeorm/repositories/ComplaintsRepository';

container.registerSingleton<IComplaintsRepository>(
  'ComplaintsRepository',
  ComplaintsRepository,
);
