import { Response, Request } from 'express';
import { container } from 'tsyringe';

import GetNotificationsByUserService from '@domains/notifications/services/GetNotificationsByUserService';

class NotificationsController {
  async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const getNotificationsByUserService = container.resolve(
      GetNotificationsByUserService,
    );

    const notifications = await getNotificationsByUserService.execute({
      user_id: userId,
    });

    return response.json(notifications);
  }
}

export default new NotificationsController();
