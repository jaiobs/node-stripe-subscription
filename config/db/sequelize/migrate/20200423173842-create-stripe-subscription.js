module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StripeSubscriptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      subscriptionId: {
        type: Sequelize.STRING,
      },
      StripePlanId: {
        type: Sequelize.INTEGER,
      },
      UserId: {
        type: Sequelize.INTEGER,
      },
      subscriptionStatus: {
        type: Sequelize.STRING,
      },
      subscribedDate: {
        type: Sequelize.DATEONLY,
      },
      subscribedEndDate: {
        type: Sequelize.DATEONLY,
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
  down: (queryInterface) => {
    return queryInterface.dropTable('StripeSubscriptions');
  },
};
