import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateComplaintService from '@domains/complaints/services/CreateComplaintService';
import ListComplaintsService from '@domains/complaints/services/ListComplaintsService';
import UpdateComplaintService from '@domains/complaints/services/UpdateComplaintService';
import DeleteComplaintService from '@domains/complaints/services/DeleteComplaintService';
import { classToClass } from 'class-transformer';

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

    let filename;

    if (request.file) {
      filename = request.file.filename;
    }

    const createComplaintService = container.resolve(CreateComplaintService);

    const newComplaint = await createComplaintService.execute({
      user_id,
      title,
      description,
      latitude: Number(latitude),
      longitude: Number(longitude),
      anonymous,
      date,
      imageFilename: filename,
    });

    return response.json(classToClass(newComplaint));
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

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const {
      complaint_id,
      title,
      description,
      latitude,
      longitude,
      anonymous,
      date,
    } = request.body;

    const updateComplaintsService = container.resolve(UpdateComplaintService);

    const updatedComplaint = await updateComplaintsService.execute({
      user_id,
      complaint_id,
      title,
      description,
      latitude,
      longitude,
      anonymous,
      date,
    });

    if (updatedComplaint.anonymous) {
      return response.json(classToClass(updatedComplaint));
    }

    return response.json(updatedComplaint);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { complaint_id } = request.body;

    const deleteComplaintService = container.resolve(DeleteComplaintService);

    await deleteComplaintService.execute({ user_id, complaint_id });

    return response.status(204).json();
  }
}

export default new ComplaintsController();
