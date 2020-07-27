import { Router } from 'express';

import SessionsController from '../controllers/SessionsController';

import createSessionValidator from '../validators/CreateSessionValidator';

const sessionsRouter = Router();

sessionsRouter.use(createSessionValidator);

sessionsRouter.post('/', SessionsController.create);

export default sessionsRouter;
