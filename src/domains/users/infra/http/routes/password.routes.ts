import { Router } from 'express';

import PasswordController from '../controllers/PasswordController';

const passwordRoutes = Router();

passwordRoutes.post('/forgot', PasswordController.create);
passwordRoutes.post('/reset', PasswordController.update);

export default passwordRoutes;
