import { container } from 'tsyringe';

import INotificationsRepository from '../rules/INotificationsRepository';
import NotificationsRepository from '../infra/typeorm/repositories/NotificationsRepository';

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);
