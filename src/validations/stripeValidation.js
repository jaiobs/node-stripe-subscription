const Joi = require('joi');

const stripeValidation = {
  createSubscription: {
    body: Joi.object({
      product: Joi.object({
        name: Joi.string().required(),
        type: Joi.string().required(),
      }),
      plan: Joi.object({
        name: Joi.string().required(),
        amount: Joi.string().required(),
        currency: Joi.string().required(),
        interval: Joi.string()
          .regex(/day|week|month|year/)
          .required(),
        usage_type: Joi.string()
          .regex(/licensed|metered/)
          .required(),
      }),
    }),
  },
  editSubscription: {
    body: Joi.object({
      product: Joi.object({
        name: Joi.string().required(),
        id: Joi.number().required(),
      }),
      plan: Joi.object({
        id: Joi.number().required(),
        name: Joi.string().required(),
        amount: Joi.string().required(),
        currency: Joi.string().required(),
        interval: Joi.string()
          .regex(/day|week|month|year/)
          .required(),
        usage_type: Joi.string()
          .regex(/licensed|metered/)
          .required(),
      }),
    }),
  },
  publishSubscription: {
    body: Joi.object({
      plan: Joi.object({
        id: Joi.number().required(),
      }),
      isPublished: Joi.boolean().required(),
    }),
  },
  addCard: {
    body: Joi.object({
      card: Joi.object({
        number: Joi.string()
          .regex(/^[0-9]{14,16}$/)
          .messages({
            'any.required': 'card number is required',
            'string.pattern.base': 'Invalid card number',
          })
          .min(14)
          .max(16)
          .required(),
        exp_month: Joi.string()
          .regex(/^[0-9]{2}$/)
          .messages({
            'any.required': 'exp_month is required',
            'string.pattern.base': 'Invalid exp_month',
          })
          .min(2)
          .max(2)
          .required(),
        exp_year: Joi.string()
          .regex(/^[0-9]{4}$/)
          .messages({
            'any.required': 'exp_year is required',
            'string.pattern.base': 'Invalid exp_year',
          })
          .min(4)
          .max(4)
          .required(),
        cvv: Joi.string()
          .regex(/^[0-9]{3,4}$/)
          .messages({
            'any.required': 'cvv is required',
            'string.pattern.base': 'Invalid cvv',
          })
          .min(3)
          .max(4)
          .required(),
      }),
    }),
  },
  changeSubscription: {
    body: Joi.object({
      id: Joi.string().required(),
    }),
  },
};

module.exports = stripeValidation;
