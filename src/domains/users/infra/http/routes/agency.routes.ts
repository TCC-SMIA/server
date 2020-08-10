import { Router } from 'express';

import AgencyController from '../controllers/AgencyController';

import createAgencyValidator from '../validators/CreateAgencyValidator';
import ensureAuthenticate from '../middlewares/ensureAuthenticate';

const agencyRoutes = Router();

agencyRoutes.post('/', createAgencyValidator, AgencyController.create);

agencyRoutes.use(ensureAuthenticate);

agencyRoutes.put('/profile', AgencyController.update);
agencyRoutes.get('/profile', AgencyController.show);

export default agencyRoutes;
