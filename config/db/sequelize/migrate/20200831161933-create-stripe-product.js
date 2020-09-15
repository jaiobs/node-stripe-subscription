module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('StripeProducts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      productName: {
        type: Sequelize.STRING,
      },
      productId: {
        type: Sequelize.STRING,
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
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
  down: async (queryInterface) => {
    await queryInterface.dropTable('StripeProducts');
  },
};
