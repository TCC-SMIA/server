import { Response, Request } from 'express';

class UsersController {
  async create(request: Request, response: Response): Promise<Response> {
    return response.json({ message: 'User controller' });
  }
}

export default new UsersController();
