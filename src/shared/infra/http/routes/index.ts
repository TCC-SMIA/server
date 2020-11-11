import { Router, Request, Response } from 'express';

import userRoutes from '@domains/users/infra/http/routes/users.routes';
import sessionsRoutes from '@domains/users/infra/http/routes/sessions.routes';
import agencyRoutes from '@domains/users/infra/http/routes/agency.routes';
import complaintsRoutes from '@domains/complaints/infra/http/routes/complaints.routes';
import commentsRoutes from '@domains/complaints/infra/http/routes/comments.routes';
import passwordRoutes from '@domains/users/infra/http/routes/password.routes';
import chatsRoutes from '@domains/chats/infra/http/routes/chats.routes';
import messagesRoutes from '@domains/chats/infra/http/routes/messages.routes';
import notificationsRoutes from '@domains/notifications/infra/http/routes/notifications.routes';

const routes = Router();

routes.get('/', (_: Request, res: Response) => {
  return res.json({
    status: 'Welcome to SMIA API',
    message: `You can access the documentation on the link: http://${process.env.APP_URL}/api/docs`,
  });
});

routes.use('/users', userRoutes);
routes.use('/agencies', agencyRoutes);
routes.use('/complaints', complaintsRoutes);
routes.use('/comments', commentsRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/password', passwordRoutes);
routes.use('/chats', chatsRoutes);
routes.use('/messages', messagesRoutes);
routes.use('/notifications', notificationsRoutes);

export default routes;
