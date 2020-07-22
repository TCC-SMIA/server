import { container } from 'tsyringe';

import UsersRepository from '../infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '../rules/IUsersRepository';
import IHashProvider from '../providers/HashProvider/rules/IHashProvider';
import BCryptHashProvider from '../providers/HashProvider/implementations/BCryptHashProvider';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IHashProvider>('HashProvider', BCryptHashProvider);
