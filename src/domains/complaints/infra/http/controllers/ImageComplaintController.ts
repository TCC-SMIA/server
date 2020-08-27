import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateImageComplaintService from '@domains/complaints/services/UpdateImageComplaintService';

class ImageComplaintController {
  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const { complaint_id } = request.body;

    const { filename } = request.file;

    const updateImageComplaintService = container.resolve(
      UpdateImageComplaintService,
    );

    const updatedComment = await updateImageComplaintService.execute({
      user_id,
      complaint_id,
      imageFilename: filename,
    });

    return response.json(classToClass(updatedComment));
  }
}

export default new ImageComplaintController();
