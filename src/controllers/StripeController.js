/* eslint-disable camelcase */
const status = require('http-status');
const stripe = require('stripe')(process.env.STRIPE_API_KEY, {
  maxNetworkRetries: 3,
});
const moment = require('moment');
const { StripePlan, StripeSubscription, StripeProduct, User } = require('../models');
const stripeService = require('../services/stripeService');
const ApiError = require('../helpers/apiError');

const StripeController = {
  /**
   * @params {header: JWT 'token'}
   * @params req.body.product.name - required
   * @params req.body.product.type
   *
   * @params req.body.plan.name
   * @params req.body.plan.amount
   * @params req.body.plan.currency must be supported format e.g ('inr', 'usd')
   * @params req.body.plan.interval  Either day, week, month or year.
   * @params req.body.plan.usage_type [licensed, metered]
   *
   * @returns {StripePlan}
   */
  async createPlan(req, res, next) {
    try {
      const product = await stripe.products.create({
        name: req.body.product.name,
        type: req.body.product.type,
      });
      if (product) {
        const planAttrs = {
          amount: req.body.plan.amount * 100,
          currency: req.body.plan.currency,
          interval: req.body.plan.interval,
          usage_type: req.body.plan.usage_type,
        };
        const plan = await stripe.plans.create({
          nickname: req.body.plan.name,
          product: product.id,
          ...planAttrs,
        });
        const plans = [
          {
            planName: req.body.plan.name,
            planId: plan.id,
            createdDate: new Date(),
            ...planAttrs,
          },
        ];

        await StripeProduct.create(
          {
            productId: product.id,
            productName: product.name,
            StripePlans: plans,
          },
          {
            include: [StripePlan],
          },
        );

        res.status(status.OK).json({ message: 'Stripe plan created successfully' });
      } else {
        throw new ApiError(status.BAD_REQUEST, "Can't create product.");
      }
    } catch (err) {
      next(err);
    }
  },
  /**
   * @params {header: JWT 'token'}
   * @params req.body.product.name - required
   * @params req.body.product.id - required
   *
   * @params req.body.plan.id - required
   * @params req.body.plan.name - required
   * @params req.body.plan.amount - required
   * @params req.body.plan.currency must be supported format e.g ('inr', 'usd')
   * @params req.body.plan.interval  Either day, week, month or year.
   * @params req.body.plan.usage_type [licensed, metered]
   *
   * @returns {StripePlan}
   */
  async editPlan(req, res, next) {
    try {
      const { product, plan } = req.body;
      const getStripeProdDetail = await StripeProduct.getBy({ id: product.id });
      if (getStripeProdDetail) {
        if (getStripeProdDetail.productName !== product.name) {
          await stripe.products.update(getStripeProdDetail.productId, {
            name: product.name,
          });
        }
      } else {
        const error = new ApiError('Product not found', status.NOT_FOUND);
        next(error);
      }
      const existingPlan = await StripePlan.getBy({ id: plan.id });
      if (existingPlan) {
        await stripe.plans.update(existingPlan.planId, {
          active: false,
        });
        await StripePlan.updatePlan(plan.id, { isActive: false });
        const planAttrs = {
          amount: req.body.plan.amount * 100,
          currency: req.body.plan.currency,
          interval: req.body.plan.interval,
          usage_type: req.body.plan.usage_type,
        };
        const newPlan = await stripe.plans.create({
          nickname: req.body.plan.name,
          product: getStripeProdDetail.productId,
          ...planAttrs,
        });
        getStripeProdDetail.createStripePlan({
          planName: req.body.plan.name,
          planId: newPlan.id,
          createdDate: new Date(),
          ...planAttrs,
        });
      }
      res.status(status.OK).json({ message: 'Plan updated' });
    } catch (err) {
      next(err);
    }
  },
  /**
   * @params {header: JWT 'token'}
   * @params req.body.plan.id
   * @params req.body.isPublished
   * @returns { message: 'Plan status updated' }
   */
  async publishPlan(req, res, next) {
    try {
      const { id } = req.body.plan;
      const getPlan = await StripePlan.getBy({ id });
      if (getPlan) {
        await StripePlan.updatePlan(id, { isActive: true });
        await StripeProduct.updateInstance(getPlan.StripeProduct.id, {
          isPublished: true,
          isActive: true,
        });
        res.status(status.OK).json({ message: 'Plan status updated' });
      } else {
        const error = new ApiError('Plan not found', status.BAD_REQUEST);
        next(error);
      }
    } catch (err) {
      next(err);
    }
  },
  /**
   * @params req.params.id
   * @returns { getPlanDetail }
   */
  async viewPlan(req, res, next) {
    try {
      const getPlanDetail = await StripePlan.getBy({ id: req.params.id });
      if (getPlanDetail) {
        res.status(status.OK).json(getPlanDetail);
      } else {
        const error = new ApiError("Can't get a plan detail.", status.BAD_REQUEST);
        next(error);
      }
    } catch (err) {
      next(err);
    }
  },
  /**
   * superAdmin - Token (required)
   * visitors - Token
   * @returns { stripePlans }
   */
  async listAllPlans(req, res, next) {
    try {
      let stripePlans;
      if (req.user && req.user.id) {
        stripePlans = await StripeProduct.getAllProduct();
      } else {
        stripePlans = await StripeProduct.getAllPublishedPlans();
      }
      res.status(status.OK).json({ stripProducts: stripePlans });
    } catch (err) {
      next(err);
    }
  },
  /**
   * @params {header: JWT 'token'}
   * @params req.body.card.number - required
   * @params req.body.card.exp_month
   * @params req.body.card.exp_year
   * @params req.body.card.cvc
   *
   * @returns {StripePlan}
   */
  async addCard(req, res, next) {
    try {
      const { user } = req;
      const customerId = user.stripeCustomerId;
      let customer;
      const { email, name, line1, city, state, country, postal_code } = user;
      const address = { line1, city, state, country, postal_code };
      if (customerId) {
        customer = await stripe.customers.retrieve(customerId);
      } else {
        customer = await stripe.customers.create({ email, name, address });
        await User.updateInstance(user.id, { stripeCustomerId: customer.id });
      }
      // eslint-disable-next-line camelcase
      const { number, exp_month, exp_year, cvc } = req.body.card;
      const payment = await stripe.paymentMethods.create({
        billing_details: {
          email: user.email,
          name: user.name,
          address,
        },
        type: 'card',
        card: {
          number,
          exp_month,
          exp_year,
          cvc,
        },
      });
      await stripe.paymentMethods.attach(payment.id, {
        customer: customer.id,
      });
      await stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: payment.id },
      });
      res.status(status.OK).json({ message: 'card added successfully' });
    } catch (error) {
      console.warn('error', error);
      next(error);
    }
  },
  /**
   * @params {header: JWT 'token'}
   * @params req.body.id (id - plan id)
   * @returns {newSubscription}
   */
  async subscribe(req, res, next) {
    try {
      const { user } = req;
      const { id } = req.user;
      const { email, name, line1, city, state, country, postal_code } = user;
      const address = { line1, city, state, country, postal_code };
      if (user) {
        const customerId = user.stripeCustomerId;
        let customer;

        if (customerId) {
          customer = await stripe.customers.retrieve(customerId);
        } else {
          customer = await stripe.customers.create({ email, name, address });
          await User.updateInstance(user.id, { stripeCustomerId: customer.id });
        }
        const plan = await StripePlan.getBy({ id: req.params.id });
        // You need to make sure that you always pass trial_end or trial_period_days
        // when you create the subscription instead.
        const alreadySubscribed = await StripeSubscription.getBy({
          UserId: id,
        });
        if (alreadySubscribed && alreadySubscribed.subscriptionStatus === 'active') {
          const error = await new ApiError('Already a subscriber', status.BAD_REQUEST);
          return next(error);
        }
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{ plan: plan.planId }],
        });
        const subscribedEnd = await stripeService.getSubscribeEndDate(plan);
        const addSubscription = {
          UserId: user.id,
          subscriptionId: subscription.id,
          subscriptionStatus: subscription.status,
          StripePlanId: plan.id,
          subscribedDate: moment().format('YYYY-MM-DD'),
          subscribedEndDate: subscribedEnd,
        };

        const newSubscription = await StripeSubscription.createInstance(addSubscription);
        // await authHelper.updateUser(req, "addSubscribe");
        res.status(status.OK).json({ message: 'success', newSubscription });
      } else {
        const error = new ApiError('User not found', status.BAD_REQUEST);
        next(error);
      }
    } catch (err) {
      next(err);
    }
  },
  /**
   * @params {header: JWT 'token'}
   * @params req.body.id (id - stripeSubscription model id)
   * @returns {stripeSubscription}
   */
  async cancelSubscription(req, res, next) {
    try {
      const { id } = req.params;
      const stripeSubscription = await StripeSubscription.getBy({ id });
      if (stripeSubscription) {
        const cancelSubscription = await stripe.subscriptions.del(
          stripeSubscription.subscriptionId,
        );
        let cancelStatus;
        const havingTime = await stripeService.checkSubscribeEndDate(stripeSubscription);
        if (havingTime) {
          cancelStatus = {
            subscriptionStatus: 'pending',
          };
        } else {
          cancelStatus = {
            subscriptionStatus: cancelSubscription.status,
          };
        }
        await stripeSubscription.updateInstance(id, cancelStatus);
        // await authHelper.updateUser(req, "cancelSubscribe");
        res.status(status.OK).json({ message: 'canceled' });
      } else {
        res.status(status.NOT_FOUND).json({ message: 'stripe subscription not found' });
      }
    } catch (error) {
      next(error);
    }
  },
  /**
   * @params {header: JWT 'token'}
   * @params req.body.id (id - stripeSubscription model id)
   * @returns {stripeSubscription}
   */
  async changeSubscription(req, res, next) {
    try {
      const { id } = req.user;
      const customerId = req.user.stripeCustomerId;
      const customer = await stripe.customers.retrieve(customerId);
      const stripeSubsciption = await StripeSubscription.getBy({ UserId: id });
      const plan = await StripePlan.getBy({ id: req.body.id });

      if (stripeSubsciption.subscriptionStatus === 'active') {
        const cancelSubscription = await stripe.subscriptions.del(stripeSubsciption.subscriptionId);
        const cancelStatus = {
          subscriptionStatus: cancelSubscription.status,
        };
        await stripeSubsciption.updateInstance(stripeSubsciption.id, cancelStatus);
      }
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan: plan.planId }],
      });
      const subscribedEnd = await stripeService.getSubscribeEndDate(plan);
      const addSubscription = {
        UserId: req.user.id,
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        StripePlanId: plan.id,
        subscribedDate: moment().format('YYYY-MM-DD'),
        subscribedEndDate: subscribedEnd,
      };
      const newSubscription = await StripeSubscription.createInstance(addSubscription);
      res.status(status.OK).json({ message: 'subscription upgraded.', newSubscription });
    } catch (error) {
      next(error);
    }
  },
  async subscribedUser(req, res, next) {
    try {
      const subscriptionList = await StripeSubscription.getPlanWithSubscription();
      if (subscriptionList) {
        res.status(status.OK).json(subscriptionList);
      } else {
        const error = new ApiError("Can't get subscriptionlist.", status.BAD_REQUEST);
        next(error);
      }
    } catch (err) {
      next(err);
    }
  },
  async view_subscription(req, res, next) {
    try {
      const subscriptionDetail = await StripeSubscription.getBy({
        UserId: req.user.id,
      });
      if (subscriptionDetail) {
        res.status(status.OK).json(subscriptionDetail);
      } else {
        const error = new ApiError("Can't get subscriptionDetail.", status.BAD_REQUEST);
        next(error);
      }
    } catch (err) {
      next(err);
    }
  },
};

module.exports = StripeController;
