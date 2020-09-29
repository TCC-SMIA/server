import { Response, Request } from 'express';
import { container } from 'tsyringe';

import GetNotificationsByUserService from '@domains/notifications/services/GetNotificationsByUserService';

class NotificationsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const getNotificationsByUserService = container.resolve(
      GetNotificationsByUserService,
    );

    const notifications = await getNotificationsByUserService.execute({
      user_id,
    });

    return response.json(notifications);
  }
}

export default new NotificationsController();
