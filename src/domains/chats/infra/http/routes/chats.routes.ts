import { Router } from 'express';

import ensureAuthenticate from '@domains/users/infra/http/middlewares/ensureAuthenticate';
import ChatsController from '../controllers/ChatsController';

const chatsRoutes = Router();

chatsRoutes.use(ensureAuthenticate);

chatsRoutes.post('/', ChatsController.create);

export default chatsRoutes;
