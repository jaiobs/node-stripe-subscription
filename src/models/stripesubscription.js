const { Op, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const StripeSubscription = sequelize.define('StripeSubscription', {
    subscriptionId: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    subscriptionStatus: DataTypes.STRING,
    StripePlanId: DataTypes.INTEGER,
    subscribedDate: DataTypes.DATEONLY,
    subscribedEndDate: DataTypes.DATEONLY,
  });

  StripeSubscription.associate = (models) => {
    StripeSubscription.belongsTo(models.StripePlan);
    StripeSubscription.belongsTo(models.User);
  };

  StripeSubscription.createInstance = async (addSubscription) => {
    const newSubscription = await StripeSubscription.create(addSubscription);

    return newSubscription;
  };

  StripeSubscription.getBy = async (attr) => {
    const stripeSubs = await StripeSubscription.findOne({
      where: { ...attr },
      include: 'StripePlan',
    });

    return stripeSubs;
  };

  StripeSubscription.getAllForCron = async () => {
    const stripeSubs = await StripeSubscription.findAll({
      where: {
        subscriptionStatus: {
          [Op.ne]: 'cancel',
        },
      },
    });

    return stripeSubs;
  };
  StripeSubscription.getPlanWithSubscription = async () => {
    const subscription = await StripeSubscription.findAll({
      include: [
        {
          association: 'StripePlan',
          attributes: [
            'id',
            'planName',
            [Sequelize.literal('amount::integer / 100'), 'amount'],
            'currency',
            'interval',
            'usageType',
            'isActive',
            'createdDate',
          ],
          include: [{ association: 'StripeProduct' }],
        },
      ],
    });
    return subscription;
  };

  StripeSubscription.prototype.updateInstance = async (id, attr) => {
    const stripeSubs = await StripeSubscription.update(attr, { where: { id } });

    return stripeSubs;
  };

  return StripeSubscription;
};
