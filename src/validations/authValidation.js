const Joi = require('joi');

const authValidation = {
  login: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  },
  register: {
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required().min(8),
    }),
  },
};

module.exports = authValidation;
