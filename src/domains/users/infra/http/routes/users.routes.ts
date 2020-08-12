import { Router } from 'express';
import multer from 'multer';
import multerConfig from '@config/multerConfig';

import UsersController from '@domains/users/infra/http/controllers/UsersController';
import AvatarController from '@domains/users/infra/http/controllers/AvatarController';

import createUserValidator from '@domains/users/infra/http/validators/CreateUserValidator';
import updateUserValidator from '@domains/users/infra/http/validators/UpdateUserValidator';

import ensureAuthenticate from '@domains/users/infra/http/middlewares/ensureAuthenticate';

const userRoutes = Router();
const upload = multer(multerConfig.multer);

userRoutes.post('/', createUserValidator, UsersController.create);

userRoutes.use(ensureAuthenticate);

userRoutes.put('/profile', updateUserValidator, UsersController.update);
userRoutes.get('/profile', UsersController.show);
userRoutes.delete('/', UsersController.delete);
userRoutes.patch('/avatar', upload.single('avatar'), AvatarController.update);

export default userRoutes;
