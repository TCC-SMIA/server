import { Response, Request } from 'express';
// import { container } from 'tsyringe';

class ComplaintsController {
  public async create(request: Request, response: Response): Promise<Response> {
    return response.json({ success: true });
  }
}

export default new ComplaintsController();
