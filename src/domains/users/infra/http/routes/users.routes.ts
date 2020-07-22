import { Router } from 'express';
import UsersController from '../controllers/AgencyController';

const userRoutes = Router();

userRoutes.post('/', UsersController.create);

export default userRoutes;
