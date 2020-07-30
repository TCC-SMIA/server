import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateAgencyService from '@domains/users/services/CreateAgencyService';
import UpdateAgencyService from '@domains/users/services/UpdateAgencyService';
import ShowAgencyService from '@domains/users/services/ShowAgencyService';
import { classToClass } from 'class-transformer';

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

    return response.json(classToClass(newAgency));
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

    return response.json(classToClass(updatedAgency));
  }

  async show(request: Request, response: Response): Promise<Response> {
    const agencyId = request.user.id;

    const showAgencyService = container.resolve(ShowAgencyService);

    const agency = await showAgencyService.execute({ agencyId });

    return response.json(classToClass(agency));
  }
}

export default new AgencyController();
