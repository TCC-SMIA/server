import { Response, Request } from 'express';
import { container } from 'tsyringe';

import GetNotificationsByUserService from '@domains/notifications/services/GetNotificationsByUserService';
import ReadNotificationService from '@domains/notifications/services/ReadNotificationService';

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

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { notification_id } = request.body;

    const service = container.resolve(ReadNotificationService);

    await service.execute({ user_id, notification_id });

    return response.json({ success: true });
  }
}

export default new NotificationsController();
