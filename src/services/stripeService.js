const stripe = require('stripe')(process.env.STRIPE_API_KEY, {
  maxNetworkRetries: 3,
});
const moment = require('moment');
const { StripePlan, StripeProduct } = require('../models');

const stripeService = {
  async editStripePlan(req, previousPlan) {
    if (req && previousPlan) {
      const editPlan = {
        nickname: req.planName,
        currency: req.currency,
        amount: req.amount.replace(/\$/g, '') * 100,
        usage_type: 'licensed',
        product: previousPlan.productId,
      };
      if (previousPlan.productName === 'Monthly Subscription') {
        editPlan.interval = 'month';
      }
      if (previousPlan.productName === 'Annual Subscription') {
        editPlan.interval = 'annual';
      }
      const plan = await stripe.plans.create(editPlan);
      delete editPlan.usage_type;
      editPlan.usageType = 'licensed';

      const StripePlanArray = {
        planId: plan.id,
        productId: previousPlan.productId,
        planName: plan.nickname,
        productName: previousPlan.productName,
        amount: editPlan.amount,
        currency: editPlan.currency,
        usageType: editPlan.usageType,
        interval: editPlan.interval,
      };
      const editedPlan = await StripePlan.createPlan(StripePlanArray);
      return editedPlan;
    }
  },
  async publishPlan(data) {
    const { id, isPublished } = data;
    const updatedPlanStatus = await StripeProduct.updatePlan(id, {
      isPublished,
    });
    return updatedPlanStatus;
  },
  async getSubscribeEndDate(plan) {
    const monthendDate = moment().add(1, 'months').format('YYYY-MM-DD');
    const yearEndDate = moment().add(1, 'years').format('YYYY-MM-DD');
    let subscribedEnd;
    if (plan.interval === 'month') {
      subscribedEnd = monthendDate;
    }
    if (plan.interval === 'year') {
      subscribedEnd = yearEndDate;
    }
    return subscribedEnd;
  },
  async checkSubscribeEndDate(subscription) {
    const now = new Date();
    const endDate = subscription.subscribedEndDate;
    const timeStamp = endDate.split('-');
    const newTimeStamp = new Date(timeStamp[0], timeStamp[1] - 1, timeStamp[2]);
    const havingTime = newTimeStamp - now;
    const diffDays = Math.ceil(havingTime / (1000 * 60 * 60 * 24));
    if (havingTime) return diffDays;

    return false;
  },
};

module.exports = stripeService;
