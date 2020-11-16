import { Router } from 'express';

import ensureAuthenticate from '@domains/users/infra/http/middlewares/ensureAuthenticate';
import MessagesController from '../controllers/MessagesController';

const messagesRouter = Router();

messagesRouter.use(ensureAuthenticate);

messagesRouter.post('/', MessagesController.create);

messagesRouter.get('/', MessagesController.index);

export default messagesRouter;
