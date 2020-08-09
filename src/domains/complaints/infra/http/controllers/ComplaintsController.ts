import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateComplaintService from '@domains/complaints/services/CreateComplaintService';
import ListComplaintsService from '@domains/complaints/services/ListComplaintsService';

class ComplaintsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const {
      title,
      description,
      date,
      latitude,
      longitude,
      anonymous,
    } = request.body;

    const createComplaintService = container.resolve(CreateComplaintService);

    const newComplaint = await createComplaintService.execute({
      user_id,
      title,
      description,
      latitude,
      longitude,
      anonymous,
      date,
    });

    return response.json(newComplaint);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { skip, take } = request.query;

    let skipParam = 0;
    let takeParam = 0;

    if (!skip) {
      skipParam = 0;
    } else {
      skipParam = Number(skip);
    }

    if (!take) {
      takeParam = 10;
    } else {
      takeParam = Number(take);
    }

    const listComplaints = container.resolve(ListComplaintsService);

    const complaints = await listComplaints.execute({
      skip: Number(skipParam),
      take: Number(takeParam),
    });

    return response.json(complaints);
  }
}

export default new ComplaintsController();
