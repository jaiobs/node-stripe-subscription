module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      line1: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING },
      state: { type: Sequelize.STRING },
      country: { type: Sequelize.STRING },
      postal_code: { type: Sequelize.STRING },
      isDeleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      stripeCustomerId: Sequelize.STRING,
      userType: {
        type: Sequelize.ENUM,
        defaultValue: 'user',
        values: ['admin', 'user'],
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Users');
  },
};
