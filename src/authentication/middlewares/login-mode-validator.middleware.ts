import { NextFunction, Request, Response } from 'express';
import { loginPayloadValidatorSchema } from '../validators/login-payload-validator.schema';
import { BadException } from '../../shared/errors';
import Logger from '../../config/logger';

export function LoginModeValidatorMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const logger = new Logger(LoginModeValidatorMiddleware.name);
  const mode = req.query?.mode ?? undefined;
  const body = req.body ?? {};

  const validationResult = loginPayloadValidatorSchema.validate({
    mode,
    ...body,
  });

  if (validationResult.error != null) {
    logger.log(JSON.stringify(validationResult.error.details));
    throw new BadException(validationResult.error.message);
  }

  next();
}
