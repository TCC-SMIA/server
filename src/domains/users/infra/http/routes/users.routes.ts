import { Router } from 'express';

import UsersController from '@domains/users/infra/http/controllers/UsersController';
import checkUserCredentials from '@domains/users/infra/http/validators/CreateUserValidator';

const userRoutes = Router();

userRoutes.post('/', checkUserCredentials, UsersController.create);

export default userRoutes;
