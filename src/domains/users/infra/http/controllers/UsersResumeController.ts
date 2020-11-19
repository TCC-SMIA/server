import { Response, Request } from 'express';
import { container } from 'tsyringe';

import GetUserResumeService from '@domains/users/services/GetUserResumeService';

class UsersResumeController {
  async show(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.query;

    const service = container.resolve(GetUserResumeService);

    const resume = await service.execute({ user_id: user_id as string });

    return response.json(resume);
  }
}

export default new UsersResumeController();
