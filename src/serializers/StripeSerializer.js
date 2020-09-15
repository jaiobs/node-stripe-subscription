const status = require('http-status');
const ApiError = require('../helpers/apiError');

const StripeSerializer = {
  serialize(stripePlan) {
    try {
      const {
        id,
        productName,
        productId,
        planId,
        planName,
        amount,
        currency,
        interval,
        createdDate,
        // eslint-disable-next-line camelcase
        usage_type,
        isPublished,
      } = stripePlan;
      return {
        id,
        productName,
        productId,
        planId,
        planName,
        amount,
        currency,
        interval,
        createdDate,
        usage_type,
        isPublished,
      };
    } catch (error) {
      const err = new ApiError(error.message, status.BAD_REQUEST);
      console.error(err);
    }
  },
};

module.exports = StripeSerializer;
