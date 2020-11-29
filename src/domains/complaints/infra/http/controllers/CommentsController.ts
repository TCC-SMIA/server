import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateCommentService from '@domains/complaints/services/CreateCommentService';
import ListCommentsService from '@domains/complaints/services/ListCommentsService';

class CommentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { content, complaint_id } = request.body;

    const createCommentService = container.resolve(CreateCommentService);

    const comment = await createCommentService.execute({
      user_id,
      content,
      complaint_id,
    });

    return response.json(comment);
  }
}

export default new CommentsController();
