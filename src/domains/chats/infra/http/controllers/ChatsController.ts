import { Response, Request } from 'express';
import { container } from 'tsyringe';
import CreateChatService from '@domains/chats/services/CreateChatService';
import GetChatsByUserService from '@domains/chats/services/GetChatsByUserService';

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

  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const service = container.resolve(GetChatsByUserService);

    const chats = await service.execute({ user_id });

    return response.json(chats);
  }
}

export default new ChatsController();
