import { Response, Request } from 'express';

class AgencyController {
  async create(request: Request, response: Response): Promise<Response> {
    const { name, cpnj, email, password } = request.body;

    return response.json({ sucess: false });
  }
}

export default new AgencyController();
