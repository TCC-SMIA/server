import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListCommentsService from '@domains/complaints/services/ListCommentsService';

class CommentsByComplaintController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { complaint_id } = request.query;

    const listCommentsService = container.resolve(ListCommentsService);

    const listComments = await listCommentsService.execute({
      complaint_id: complaint_id as string,
    });

    return response.json(listComments);
  }
}

export default new CommentsByComplaintController();
