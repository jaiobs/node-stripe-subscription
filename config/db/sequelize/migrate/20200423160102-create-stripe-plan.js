module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StripePlans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      planName: {
        type: Sequelize.STRING,
      },
      planId: {
        type: Sequelize.STRING,
      },
      StripeProductId: {
        type: Sequelize.INTEGER,
      },
      amount: {
        type: Sequelize.STRING,
      },
      currency: {
        type: Sequelize.STRING,
      },
      interval: {
        type: Sequelize.STRING,
      },
      usageType: {
        type: Sequelize.STRING,
      },
      createdDate: {
        type: Sequelize.DATEONLY,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    return queryInterface.dropTable('StripePlans');
  },
};
