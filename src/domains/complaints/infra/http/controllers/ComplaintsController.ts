import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateComplaintService from '@domains/complaints/services/CreateComplaintService';

class ComplaintsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { title, description, date } = request.body;

    const createComplaintService = container.resolve(CreateComplaintService);

    const newComplaint = await createComplaintService.execute({
      user_id,
      title,
      description,
      date,
    });

    return response.json(newComplaint);
  }
}

export default new ComplaintsController();
