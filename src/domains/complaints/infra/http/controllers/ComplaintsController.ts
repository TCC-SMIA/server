import { Response, Request } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateComplaintService from '@domains/complaints/services/CreateComplaintService';
import ListComplaintsService from '@domains/complaints/services/ListComplaintsService';
import UpdateComplaintService from '@domains/complaints/services/UpdateComplaintService';
import DeleteComplaintService from '@domains/complaints/services/DeleteComplaintService';
import GetComplaintService from '@domains/complaints/services/GetComplaintService';

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
      type,
    } = request.body;

    let filename;

    if (request.file) {
      filename = request.file.filename;
    }

    let anonymous_info = false;

    if (anonymous === '1') {
      anonymous_info = true;
    }

    const createComplaintService = container.resolve(CreateComplaintService);

    const newComplaint = await createComplaintService.execute({
      user_id,
      title,
      description,
      latitude: Number(latitude),
      longitude: Number(longitude),
      anonymous: anonymous_info,
      date,
      imageFilename: filename,
      type,
    });

    return response.json(classToClass(newComplaint));
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const { skip, take, city, state } = request.query;

    let cityParam;
    let stateParam;
    let skipParam = 0;
    let takeParam = 0;

    if (!city) {
      cityParam = undefined;
    } else {
      cityParam = String(city);
    }

    if (!state) {
      stateParam = undefined;
    } else {
      stateParam = String(state);
    }

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
      city: cityParam,
      state: stateParam,
    });

    return response.json(classToClass(complaints));
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
      status,
      type,
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
      status,
      type,
    });

    return response.json(classToClass(updatedComplaint));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { complaint_id } = request.query;

    const deleteComplaintService = container.resolve(DeleteComplaintService);

    await deleteComplaintService.execute({
      user_id,
      complaint_id: complaint_id as string,
    });

    return response.status(204).json();
  }

  public async show(request: Request, response: Response) {
    const { complaint_id } = request.params;

    const getComplaitService = container.resolve(GetComplaintService);

    const complaint = await getComplaitService.execute({ complaint_id });

    return response.json(classToClass(complaint));
  }
}

export default new ComplaintsController();
