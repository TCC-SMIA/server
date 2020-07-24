import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateAgencyService from '@domains/users/services/CreateAgencyService';

class AgencyController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, cnpj, email, password } = request.body;

    console.log('Entrou aqui no controller AgencyController');
    const createAgencyService = container.resolve(CreateAgencyService);

    const newAgency = await createAgencyService.execute({
      name,
      cnpj,
      email,
      password,
    });

    console.log('Final do controller AgencyController');
    return response.json(newAgency);
  }
}

export default new AgencyController();
