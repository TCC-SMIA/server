import { Response, Request, NextFunction } from 'express';
import * as Yup from 'yup';

import AppError from '@shared/errors/AppError';
import getValidationErrors from '@shared/utils/getValidationErrors';

const resolveComplaintValidator = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const userData = request.body;

  try {
    const userSchema = Yup.object().shape({
      complaint_id: Yup.string().required('The field complaint_id is required'),
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

export default resolveComplaintValidator;
