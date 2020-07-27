import { Response, Request, NextFunction } from 'express';
import * as Yup from 'yup';

import AppError from '@shared/errors/AppError';
import getValidationErrors from '@shared/utils/getValidationErrors';

const createSessionValidator = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const userData = request.body;

  try {
    const userSchema = Yup.object().shape({
      nickname: Yup.string().matches(
        /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
        'Insert a valid nickname without especials characters',
      ),
      email: Yup.string().email('Insert a valid email.'),
      password: Yup.string()
        .min(6, 'At least 6 characters in the password field')
        .required('Password is a required field'),
    });

    await userSchema.validate(userData, { abortEarly: false });

    return next();
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors = getValidationErrors(error);

      return response.status(401).json({ status: 'error', errors });
    }
    throw new AppError('An error occurred while validating user data.', 401);
  }
};

export default createSessionValidator;
