import { Request, Response } from 'express';
import { container } from 'tsyringe';

import GetComplaintsByUserService from '@domains/complaints/services/GetComplaintsByUserService';

class ComplaintsByUserController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const service = container.resolve(GetComplaintsByUserService);

    const complaint = await service.execute({ user_id });

    return response.json(complaint);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.query;

    const service = container.resolve(GetComplaintsByUserService);

    const complaints = await service.execute({ user_id: user_id as string });

    return response.json(complaints);
  }
}

export default new ComplaintsByUserController();
