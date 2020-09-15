const { Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const StripePlan = sequelize.define('StripePlan', {
    planName: DataTypes.STRING,
    planId: DataTypes.STRING,
    amount: DataTypes.STRING,
    currency: DataTypes.STRING,
    interval: DataTypes.STRING,
    usageType: DataTypes.STRING,
    createdDate: new Date(),
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    StripeProductId: DataTypes.INTEGER,
  });

  StripePlan.associate = (models) => {
    StripePlan.hasMany(models.StripeSubscription);
    StripePlan.belongsTo(models.StripeProduct);
  };

  StripePlan.getAll = async () => {
    const stripePlans = await StripePlan.findAll();

    return stripePlans;
  };

  StripePlan.getBy = async (attr) => {
    const stripePlan = await StripePlan.findOne({
      where: { ...attr },
      attributes: [
        'id',
        [Sequelize.literal('amount::integer / 100'), 'amount'],
        'currency',
        'interval',
        'isActive',
        'planId',
      ],
      include: [
        {
          association: 'StripeProduct',
          attributes: ['id', 'productName', 'isPublished', 'isActive'],
        },
      ],
    });

    return stripePlan;
  };

  StripePlan.createPlan = async (attributes) => {
    const newPlan = await StripePlan.create(attributes);

    return newPlan;
  };

  StripePlan.updatePlan = async (id, attributes) => {
    const updatedPlan = await StripePlan.update(attributes, { where: { id } });
    return updatedPlan;
  };

  return StripePlan;
};
