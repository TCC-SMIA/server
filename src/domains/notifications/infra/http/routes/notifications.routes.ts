import { Router } from 'express';

import ensureAuthenticate from '@domains/users/infra/http/middlewares/ensureAuthenticate';
import NotificationsController from '../controllers/NotificationsController';

const notificationsRoutes = Router();

notificationsRoutes.use(ensureAuthenticate);

notificationsRoutes.get('/', NotificationsController.show);

export default notificationsRoutes;
