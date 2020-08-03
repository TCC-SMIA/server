import { Router } from 'express';

import ensureAuthenticate from '@domains/users/infra/http/middlewares/ensureAuthenticate';
import CommentsController from '../controllers/CommentsController';

const complaintsRoutes = Router();

complaintsRoutes.use(ensureAuthenticate);

complaintsRoutes.post('/', CommentsController.create);

export default complaintsRoutes;
