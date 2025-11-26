import { Joi, validate } from 'express-validation';

const createUserValidate = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

const updateUserValidate = {
  body: Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(6),
  }).min(1),
};

const loginValidate = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  }),
};

export default {
  createUserValidation: validate(createUserValidate, { keyByField: true }),
  updateUserValidation: validate(updateUserValidate, { keyByField: true }),
  loginValidation: validate(loginValidate, { keyByField: true }),
};
