const status = require('http-status');
const ApiError = require('../helpers/apiError');

const SubscriptionSerializer = {
  serialize(subscription) {
    try {
      const { id, subscriptionType, years, months, days, amount } = subscription;
      return {
        id,
        subscriptionType,
        years,
        months,
        days,
        amount,
      };
    } catch (error) {
      const err = new ApiError(error.message, status.BAD_REQUEST);
      // eslint-disable-next-line no-console
      console.error(err);
    }
  },
};

module.exports = SubscriptionSerializer;
