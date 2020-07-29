import { container } from 'tsyringe';

import IUsersRepository from '../rules/IUsersRepository';
import UsersRepository from '../infra/typeorm/repositories/UsersRepository';

import IAgencyRepository from '../rules/IAgencyRepository';
import AgencyRepository from '../infra/typeorm/repositories/AgencyRepository';

import IHashProvider from '../providers/HashProvider/rules/IHashProvider';
import BCryptHashProvider from '../providers/HashProvider/implementations/BCryptHashProvider';

import IUserTokensRepository from '../rules/IUserTokensRepository';
import UserTokensRepository from '../infra/typeorm/repositories/UserTokensRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IAgencyRepository>(
  'AgencyRepository',
  AgencyRepository,
);

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);
