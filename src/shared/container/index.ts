import { container } from 'tsyringe';

import '@domains/users/container';
import '@domains/complaints/container';
import '@domains/notifications/container';
import '@domains/chats/container';

import IMailProvider from '@shared/providers/MailProvider/rules/IMailProvider';
import EtherealMailProvider from '@shared/providers/MailProvider/implementations/EtherealMailProvider';

import IStorageProvider from '@shared/providers/StorageProvider/rules/IStorageProvider';
import DiskStorageProvider from '@shared/providers/StorageProvider/implementations/DiskStorageProvider';

container.registerInstance<IMailProvider>(
  'MailProvider',
  new EtherealMailProvider(),
);

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);
