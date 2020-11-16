import { Request, Response } from 'express';
import { container } from 'tsyringe';

import GetAvailableComplaintTypeService from '@domains/complaints/services/GetAvailableComplaintTypeService';

class ComplaintsTypeController {
  public async index(_: Request, response: Response): Promise<Response> {
    const service = container.resolve(GetAvailableComplaintTypeService);

    const types = await service.execute();

    return response.json(types);
  }
}

export default new ComplaintsTypeController();
