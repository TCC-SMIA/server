import { Request, Response } from 'express';

export default class SessionsController {
  public async create(request: Request, response: Response) {
    const { email, password } = request.body;

    console.log(email, password);

    return response.json({ message: 'TOKEN' });
  }
}
