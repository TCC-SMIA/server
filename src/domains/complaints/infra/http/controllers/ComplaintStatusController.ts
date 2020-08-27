import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResolveComplaintService from '@domains/complaints/services/ResolveComplaintService';

class ComplaintStatusController {
  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { complaint_id } = request.body;

    const service = container.resolve(ResolveComplaintService);

    const complaint = await service.execute({ complaint_id, user_id });

    return response.json(complaint);
  }
}

export default new ComplaintStatusController();
