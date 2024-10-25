import Joi from 'joi';

export const registerSchema = Joi.object({
  title: Joi.string().max(255).required(),
  authors: Joi.array().items(Joi.string().required()).required(),
  publisher: Joi.string().max(255).required(),
  published: Joi.date().iso().required(),
  genre: Joi.array().items(Joi.string().required()).required(),
  summary: Joi.string().optional(),
  cover_image: Joi.string().optional(),
});
