import { Router } from 'express';
import AgencyController from '../controllers/AgencyController';

const agencyRoutes = Router();

agencyRoutes.post('/', AgencyController.create);

export default agencyRoutes;
