import { Response, Request, NextFunction } from 'express';
import * as Yup from 'yup';

import AppError from '@shared/errors/AppError';
import getValidationErrors from '@shared/utils/getValidationErrors';

const createAgencyValidator = async (
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<Response | void> => {
  const agencyData = request.body;

  try {
    const agencySchema = Yup.object().shape({
      name: Yup.string()
        .matches(
          /^[a-zA-Z]{2,}(?: [a-zA-Z]+){0,2}$/,
          'Insert a valid name without especials characters.',
        )
        .required('Name is a required field.'),
      cnpj: Yup.string().matches(
        /([0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}-?[0-9]{2})$/,
        'Insert a valid CNPJ.',
      ),
      email: Yup.string().email('Insert a valid email.'),
      password: Yup.string()
        .min(6, 'At least 6 characters in the password field.')
        .required('Password is a required field.'),
    });

    await agencySchema.validate(agencyData, { abortEarly: false });

    return next();
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors = getValidationErrors(error);

      return response.status(401).json({ status: 'error', errors });
    }
    throw new AppError('An error occurred while validating user data.', 401);
  }
};

export default createAgencyValidator;
