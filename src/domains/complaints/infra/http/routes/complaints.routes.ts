import { Router } from 'express';

import ComplaintsController from '@domains/complaints/infra/http/controllers/ComplaintsController';

import ensureAuthenticate from '@domains/users/infra/http/middlewares/ensureAuthenticate';

const complaintsRoutes = Router();

complaintsRoutes.use(ensureAuthenticate);

complaintsRoutes.post('/', ComplaintsController.create);
complaintsRoutes.put('/update', ComplaintsController.update);
complaintsRoutes.get('/', ComplaintsController.index);

export default complaintsRoutes;
