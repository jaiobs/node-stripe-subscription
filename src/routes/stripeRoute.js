const { Router } = require('express');
const { validate } = require('express-validation');
const status = require('http-status');
const { StripeController } = require('../controllers');
const { stripeValidation } = require('../validations');
const passportConfig = require('../config/passport');
const ApiError = require('../helpers/apiError');

const isAdmin = (req, res, next) => {
  if (req.user.userType === 'admin') {
    next();
  } else {
    const error = new ApiError('Access Forbidden', status.FORBIDDEN);
    next(error);
  }
};

const stripeRoute = {
  get router() {
    const router = Router();
    router.post(
      '/create_plan',
      passportConfig.isAuthenticated,
      isAdmin,
      validate(stripeValidation.createSubscription, { keyByField: true }, { abortEarly: false }),
      StripeController.createPlan,
    );
    router.post(
      '/edit_plan',
      passportConfig.isAuthenticated,
      isAdmin,
      validate(stripeValidation.editSubscription, { keyByField: true }, { abortEarly: false }),
      StripeController.editPlan,
    );
    router.post(
      '/publish_plan',
      passportConfig.isAuthenticated,
      isAdmin,
      validate(stripeValidation.publishSubscription, { keyByField: true }, { abortEarly: false }),
      StripeController.publishPlan,
    );
    router.get('/list_all_plans', passportConfig.isAuthenticated, StripeController.listAllPlans);
    router.get('/list_plans', StripeController.listAllPlans);
    router.post(
      '/upgrade',
      passportConfig.isAuthenticated,
      validate(stripeValidation.changeSubscription, { keyByField: true }, { abortEarly: false }),
      StripeController.changeSubscription,
    );
    router.get('/view_plan/:id', StripeController.viewPlan);
    router.get(
      '/subscription_list',
      passportConfig.isAuthenticated,
      StripeController.subscribedUser,
    );
    router.get(
      '/view_subscription',
      passportConfig.isAuthenticated,
      StripeController.view_subscription,
    );
    router.post(
      '/add_card',
      passportConfig.isAuthenticated,
      validate(stripeValidation.addCard, { keyByField: true }, { abortEarly: false }),
      StripeController.addCard,
    );
    router
      .route('/subscribe/:id')
      .post(passportConfig.isAuthenticated, StripeController.subscribe)
      .delete(passportConfig.isAuthenticated, StripeController.cancelSubscription);
    return router;
  },
};

module.exports = stripeRoute;
