import Joi from 'joi';

export const signupPayloadValidatorSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string()
    .email({ tlds: { allow: true } })
    .required(),
  phone_number: Joi.string()
    .pattern(/^\+/)
    .message('phone number must be in international format (starting with a +)')
    .min(8)
    .max(15)
    .required(),
  password: Joi.string().required(),
  confirm_password: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .options({ messages: { 'any.only': 'password does not match' } }),
});
