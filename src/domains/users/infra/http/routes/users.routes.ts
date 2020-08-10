import { Router } from 'express';

import UsersController from '@domains/users/infra/http/controllers/UsersController';

import createUserValidator from '@domains/users/infra/http/validators/CreateUserValidator';
import updateUserValidator from '@domains/users/infra/http/validators/UpdateUserValidator';

import ensureAuthenticate from '@domains/users/infra/http/middlewares/ensureAuthenticate';

const userRoutes = Router();

userRoutes.post('/', createUserValidator, UsersController.create);

userRoutes.use(ensureAuthenticate);

userRoutes.put('/profile', updateUserValidator, UsersController.update);
userRoutes.get('/profile', UsersController.show);
userRoutes.delete('/', UsersController.delete);

export default userRoutes;
