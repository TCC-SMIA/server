import { Router } from 'express';

import ensureAuthenticate from '@domains/users/infra/http/middlewares/ensureAuthenticate';
import CommentsController from '../controllers/CommentsController';
import CommentsByComplaintController from '../controllers/CommentsByComplaintController';

const commentsRoutes = Router();

commentsRoutes.use(ensureAuthenticate);

commentsRoutes.post('/', CommentsController.create);
commentsRoutes.get('/', CommentsByComplaintController.index);

export default commentsRoutes;
