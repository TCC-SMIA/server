import { container } from 'tsyringe';

import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '../rules/IUsersRepository';
import IHashProvider from '../providers/HashProvider/rules/IHashProvider';
import IAgencyRepository from '../rules/IAgencyRepository';
import AgencyRepository from '../infra/typeorm/repositories/AgencyRepository';
import BCryptHashProvider from '../providers/HashProvider/implementations/BCryptHashProvider';
import AgencyRepository from '../infra/typeorm/repositories/AgencyRepository';
import IAgencyRepository from '../rules/IAgencyRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IAgencyRepository>(
  'AgencyRepository',
  AgencyRepository,
);

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
