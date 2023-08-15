import Joi from 'joi';
import { LOGIN_MODE } from '../../shared/enums';

export const loginPayloadValidatorSchema = Joi.object({
  mode: Joi.string()
    .valid(LOGIN_MODE.EMAIL, LOGIN_MODE.PHONE)
    .default(LOGIN_MODE.EMAIL),

  email: Joi.string().when('mode', {
    is: Joi.string().valid(LOGIN_MODE.EMAIL),
    then: Joi.string().required(),
    otherwise: Joi.required().optional(),
  }),

  phone_number: Joi.string().when('mode', {
    is: Joi.string().valid(LOGIN_MODE.PHONE),
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
}).unknown();
