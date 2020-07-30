import { Router } from 'express';

import PasswordController from '../controllers/PasswordController';

import forgotPasswordValidator from '../validators/ForgotPasswordValidator';
import resetPasswordValidator from '../validators/ResetPasswordValidator';

const passwordRoutes = Router();

passwordRoutes.post(
  '/forgot',
  forgotPasswordValidator,
  PasswordController.create,
);
passwordRoutes.post(
  '/reset',
  resetPasswordValidator,
  PasswordController.update,
);

export default passwordRoutes;
