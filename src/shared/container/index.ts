import { container } from 'tsyringe';

import '@domains/users/container';
import '@domains/complaints/container';

import IMailProvider from '@shared/providers/MailProvider/rules/IMailProvider';
import EtherealMailProvider from '@shared/providers/MailProvider/implementations/EtherealMailProvider';

container.registerInstance<IMailProvider>(
  'MailProvider',
  new EtherealMailProvider(),
);
