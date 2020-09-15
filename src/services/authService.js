const { User } = require('../models');

const authService = {
  async createUser(user, done) {
    try {
      const userData = user;
      const userDetail = await User.createInstance(userData);
      done(userDetail, false);
    } catch (error) {
      done(null, error);
    }
  },
};

module.exports = authService;
