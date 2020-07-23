import { Router } from 'express';

import UsersController from '@domains/users/infra/http/controllers/UsersController';
import checkUserCredentials from '@domains/users/infra/http/validators/CreateUserValidator';

import ensureAuthenticate from '@domains/users/infra/http/middlewares/ensureAuthenticate';

const userRoutes = Router();

userRoutes.post('/', checkUserCredentials, UsersController.create);
userRoutes.put('/profile', ensureAuthenticate, UsersController.update);
userRoutes.get('/profile', ensureAuthenticate, UsersController.show);

export default userRoutes;
