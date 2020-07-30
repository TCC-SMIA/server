import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateAgencyService from '@domains/users/services/CreateAgencyService';
import UpdateAgencyService from '@domains/users/services/UpdateAgencyService';

class AgencyController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, cnpj, email, password } = request.body;

    const createAgencyService = container.resolve(CreateAgencyService);

    const newAgency = await createAgencyService.execute({
      name,
      cnpj,
      email,
      password,
    });

    return response.json(newAgency);
  }

  async update(request: Request, response: Response): Promise<Response> {
    const agencyId = request.user.id;
    const {
      name,
      email,
      oldpassword,
      password,
      password_confirmation,
    } = request.body;

    const updateAgencyService = container.resolve(UpdateAgencyService);

    const updatedAgency = await updateAgencyService.execute({
      agencyId,
      name,
      email,
      oldpassword,
      password,
      password_confirmation,
    });

    return response.json(updatedAgency);
  }
}

export default new AgencyController();
