const status = require('http-status');
const bcrypt = require('bcrypt');
const ApiError = require('../helpers/apiError');
const jwtGenerator = require('../middlewares/jwtGenerator');
const { User } = require('../models');
const { UserSerializer } = require('../serializers');
const authService = require('../services/authService');

const AuthController = {
  /**
   * Create new user
   * @params {string} req.body.email
   * @params {string} req.body.username
   * @params {string} req.body.phone
   * @params {string} req.body.password
   * @returns {User}
   */
  async register(req, res, next) {
    const userData = req.body;
    const userExist = await User.getBy({ email: userData.email });
    if (userExist) {
      const err = new ApiError('Email already exist', status.BAD_REQUEST);
      next(err);
    } else {
      try {
        authService.createUser(userData, (userDetail, error) => {
          if (error) {
            next(error);
          } else {
            res.status(status.CREATED).json({ user: UserSerializer.serialize(userDetail) });
          }
        });
      } catch (err) {
        next(err);
      }
    }
  },
  /**
   * Returns jwt token if valid email and password is provided
   * @params {string} req.body.email
   * @params {string} req.body.password
   * @returns { token }
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.getBy({ email });
      if (!user) {
        const error = new ApiError('User not found', status.NOT_FOUND);
        next(error);
      }
      const verifyPassword = await bcrypt.compare(password, user.password);
      if (!verifyPassword) {
        const error = new ApiError('Password mismatch', status.UNAUTHORIZED);
        next(error);
      }
      const token = await jwtGenerator.token(user);
      res.status(status.OK).json({ token, role: user.userType });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = AuthController;
