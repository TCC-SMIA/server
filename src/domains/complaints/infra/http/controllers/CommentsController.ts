import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

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

    return response.json(classToClass(comment));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { complaint_id } = request.body;

    const listCommentsService = container.resolve(ListCommentsService);

    const listComments = listCommentsService.execute({ complaint_id });

    return response.json(classToClass(listComments));
  }
}

export default new CommentsController();
