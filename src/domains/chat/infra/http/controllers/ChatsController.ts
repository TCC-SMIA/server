import { Response, Request } from 'express';
import { container } from 'tsyringe';
import CreateChatService from '@domains/chat/services/CreateChatService';

class ChatsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { contact_id } = request.body;

    const createChatService = container.resolve(CreateChatService);

    const createdChat = await createChatService.execute({
      user_id,
      contact_id,
    });

    return response.json(createdChat);
  }
}

export default new ChatsController();
