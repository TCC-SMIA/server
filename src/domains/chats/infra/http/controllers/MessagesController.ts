import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateMessageService from '@domains/chats/services/CreateMessageService';

class MessagesController {
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
