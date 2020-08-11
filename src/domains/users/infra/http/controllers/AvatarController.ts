import { Response, Request } from 'express';

class AvatarController {
  async update(request: Request, response: Response): Promise<Response> {
    console.log(request.file);
    return response.json({ success: true });
  }
}

export default new AvatarController();
