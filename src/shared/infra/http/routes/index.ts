import { Router, Request, Response } from 'express';

import userRoutes from 'domains/users/infra/http/routes/users.routes';
import sessionsRoutes from 'domains/users/infra/http/routes/sessions.routes';

const routes = Router();

routes.get('/', (_: Request, res: Response) => {
  return res.json({ status: 'Running', message: 'API Running' });
});
routes.use('/users', userRoutes);
routes.use('/sessions', sessionsRoutes);

export default routes;
