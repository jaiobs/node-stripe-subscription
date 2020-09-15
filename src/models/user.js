const { bcryptPassword } = require('../services/password');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Email format is Invalid.',
        },
      },
    },
    password: DataTypes.STRING,
    userType: {
      type: DataTypes.ENUM,
      values: ['admin', 'user'],
    },
    stripeCustomerId: DataTypes.STRING,
    line1: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    postal_code: DataTypes.STRING,
  });

  User.getAll = async () => {
    const users = await User.findAll({ where: { isDeleted: false } });

    return users;
  };

  User.getBy = async (attr) => {
    const user = await User.findOne({ where: { ...attr } });

    return user;
  };

  User.createInstance = async (userData) => {
    const newUser = await User.create(userData);

    return newUser;
  };

  User.updateInstance = async (id, args) => {
    const user = await User.update(args, { where: { id } });

    return user;
  };

  User.beforeCreate(async (user) => {
    const userData = user;
    await bcryptPassword(userData.password, (encPassword) => {
      userData.password = encPassword;
    });
    userData.userType = 'user';
  });

  return User;
};
