import { Response, Request, NextFunction } from 'express';
import * as Yup from 'yup';

import AppError from '@shared/errors/AppError';
import getValidationErrors from '@shared/utils/getValidationErrors';

const forgotPasswordValidator = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const emailData = request.body;

  try {
    const emailSchema = Yup.object().shape({
      email: Yup.string()
        .email('Insert a valid email.')
        .required('Email is required'),
    });

    await emailSchema.validate(emailData, { abortEarly: false });

    return next();
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors = getValidationErrors(error);

      return response.status(401).json({ status: 'error', errors });
    }
    throw new AppError('An error occurred while validating user data.', 401);
  }
};

export default forgotPasswordValidator;
