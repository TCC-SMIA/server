import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateMessageService from '@domains/chats/services/CreateMessageService';
import GetMessagesByChatService from '@domains/chats/services/GetMessagesByChatService';

class MessagesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { chat_id } = request.query;

    const getMessagesByChatService = container.resolve(
      GetMessagesByChatService,
    );

    const messages = await getMessagesByChatService.execute({
      chat_id: chat_id as string,
      user_id,
    });

    return response.json(messages);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { chat_id, content } = request.body;

    const createMessageService = container.resolve(CreateMessageService);

    const createdMessage = await createMessageService.execute({
      user_id,
      chat_id,
      content,
    });

    return response.json(createdMessage);
  }
}

export default new MessagesController();
