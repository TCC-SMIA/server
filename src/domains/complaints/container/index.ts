import { container } from 'tsyringe';

import IComplaintsRepository from '../rules/IComplaintsRepository';
import ComplaintsRepository from '../infra/typeorm/repositories/ComplaintsRepository';
import ICommentsRepository from '../rules/ICommentsRepository';
import CommentsRepository from '../infra/typeorm/repositories/CommentsRepository';

container.registerSingleton<IComplaintsRepository>(
  'ComplaintsRepository',
  ComplaintsRepository,
);

container.registerSingleton<ICommentsRepository>(
  'CommentsRepository',
  CommentsRepository,
);
