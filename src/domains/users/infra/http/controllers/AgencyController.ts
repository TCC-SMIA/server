import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateAgencyService from 'domains/users/services/CreateAgencyService';

class AgencyController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, cnpj, email, password } = request.body;

    const createAgencyService = container.resolve(CreateAgencyService);

    createAgencyService.execute({ name, cnpj, email, password });

    return response.json({ sucess: false });
  }
}

export default new AgencyController();
