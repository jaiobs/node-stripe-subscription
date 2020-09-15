const { Router } = require('express');
const { validate } = require('express-validation');
const { AuthController } = require('../controllers');
const { authValidation } = require('../validations');

const authRoute = {
  get router() {
    const router = Router();
    router.post(
      '/register',
      validate(authValidation.register, { keyByField: true }, { abortEarly: false }),
      AuthController.register,
    );
    router.post(
      '/login',
      validate(authValidation.login, { keyByField: true }, { abortEarly: false }),
      AuthController.login,
    );
    return router;
  },
};

module.exports = authRoute;
