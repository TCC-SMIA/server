import { container } from 'tsyringe';

import IChatsRepository from '../rules/IChatsRepository';
import ChatsRepository from '../infra/typeorm/repositories/ChatsRepository';

import IMessagesRepository from '../rules/IMessagesRepository';
import MessagesRepository from '../infra/typeorm/repositories/MessagesRepository';
import CheckChatAlreadyExistsService from '../services/CheckChatAlreadyExistsService';

container.registerSingleton<IChatsRepository>(
  'ChatsRepository',
  ChatsRepository,
);

container.registerSingleton<IMessagesRepository>(
  'MessagesRepository',
  MessagesRepository,
);

container.registerSingleton<CheckChatAlreadyExistsService>(
  'CheckChatAlreadyExistsService',
  CheckChatAlreadyExistsService,
);
