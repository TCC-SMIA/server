import { container } from 'tsyringe';
import { Request, Response } from 'express';

import SendForgotPasswordEmailService from '@domains/users/services/SendForgotPasswordEmailService';
import ResetPasswordService from '@domains/users/services/ResetPasswordService';

class PasswordController {
  public async create(request: Request, response: Response) {
    const { email } = request.body;

    const sendForgotPasswordEmailService = container.resolve(
      SendForgotPasswordEmailService,
    );

    await sendForgotPasswordEmailService.execute({
      email,
    });

    return response.status(204).json();
  }

  public async update(request: Request, response: Response) {
    const { password, token } = request.body;

    const resetPasswordService = container.resolve(ResetPasswordService);

    await resetPasswordService.execute({ password, token });

    return response.status(204).json();
  }
}

export default new PasswordController();
