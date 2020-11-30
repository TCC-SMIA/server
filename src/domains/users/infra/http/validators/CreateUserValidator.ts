import { Response, Request, NextFunction } from 'express';
import * as Yup from 'yup';

import AppError from '@shared/errors/AppError';
import getValidationErrors from '@shared/utils/getValidationErrors';

const createUserValidator = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const userData = request.body;

  try {
    const userSchema = Yup.object().shape({
      name: Yup.string()
        .matches(
          /\b[A-Za-z](?!\s)/,
          'Insert a user valid name without especials characters',
        )
        .required('Name is a required field.'),
      nickname: Yup.string()
        .matches(
          /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/,
          'Insert a valid nickname without especials characters',
        )
        .required('Nickname is a required field.'),
      email: Yup.string()
        .email('Insert a valid email.')
        .required('Email is a required field.'),
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

export default createUserValidator;
