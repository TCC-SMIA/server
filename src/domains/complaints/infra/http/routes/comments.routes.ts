import { Router } from 'express';

import ensureAuthenticate from '@domains/users/infra/http/middlewares/ensureAuthenticate';
import CommentsController from '../controllers/CommentsController';

const commentsRoutes = Router();

commentsRoutes.use(ensureAuthenticate);

commentsRoutes.post('/', CommentsController.create);
commentsRoutes.get('/', CommentsController.index);

export default commentsRoutes;
