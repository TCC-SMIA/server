import { Router } from 'express';

import AgencyController from '../controllers/AgencyController';

import createAgencyValidator from '../validators/CreateAgencyValidator';

const agencyRoutes = Router();

agencyRoutes.post('/', createAgencyValidator, AgencyController.create);

export default agencyRoutes;
