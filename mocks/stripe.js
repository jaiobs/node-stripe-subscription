class Stripe {}
const stripe = jest.fn(() => new Stripe());

const createCustomerMock = jest.fn(() => ({
  id: 1,
}));
Stripe.prototype.customers = {
  create: createCustomerMock,
};

module.exports = stripe;
module.exports.Stripe = Stripe;
