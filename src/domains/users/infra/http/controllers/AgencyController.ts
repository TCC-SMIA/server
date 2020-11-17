import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateAgencyService from '@domains/users/services/CreateAgencyService';
import { classToClass } from 'class-transformer';
import { UserTypes } from '@domains/users/enums/UserEnums';

class AgencyController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, cnpj, email, password } = request.body;

    const createAgencyService = container.resolve(CreateAgencyService);

    const newAgency = await createAgencyService.execute({
      name,
      cnpj,
      email,
      password,
      type: UserTypes.EnvironmentalAgency,
    });

    return response.json(classToClass(newAgency));
  }
}

export default new AgencyController();
