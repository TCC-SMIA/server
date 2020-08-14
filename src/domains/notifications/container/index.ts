import { container } from 'tsyringe';

import INotificationsRepository from '../rules/INotificationsRepository';
import NotificationsRepository from '../infra/typeorm/repositories/NotificationsRepository';
import CreateNotificationService from '../services/CreateNotificationService';

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);

container.registerSingleton<CreateNotificationService>(
  'CreateNotificationService',
  CreateNotificationService,
);
