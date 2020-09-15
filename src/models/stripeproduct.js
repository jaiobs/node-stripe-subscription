const { Model, Sequelize, Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StripeProduct extends Model {
    static associate(models) {
      StripeProduct.hasMany(models.StripePlan);
    }
  }
  StripeProduct.init(
    {
      productName: DataTypes.STRING,
      productId: DataTypes.STRING,
      isPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'StripeProduct',
    },
  );

  StripeProduct.getAllProduct = () => {
    return StripeProduct.findAll({
      attributes: ['id', 'productName', 'isPublished', 'isActive'],
      include: [
        {
          required: false,
          duplicating: false,
          association: 'StripePlans',
          attributes: [
            'id',
            [Sequelize.literal('amount::integer / 100'), 'amount'],
            'currency',
            'interval',
            'isActive',
            'createdDate',
            [
              Sequelize.fn('COUNT', Sequelize.col('StripePlans.StripeSubscriptions.id')),
              'subscriptibedUsersCount',
            ],
          ],
          include: [
            {
              required: false,
              duplicating: false,
              association: 'StripeSubscriptions',
              attributes: [],
              where: {
                subscriptionStatus: {
                  [Op.ne]: 'cancel',
                },
              },
            },
          ],
        },
      ],
      group: ['StripeProduct.id', 'StripePlans.id'],
    });
  };

  StripeProduct.getAllPublishedPlans = async () => {
    const stripePlans = await StripeProduct.findAll({
      where: { isPublished: true },
      attributes: ['id', 'productName', 'isPublished', 'isActive'],
      include: [
        {
          association: 'StripePlans',
          attributes: [
            'id',
            [Sequelize.literal('amount::integer / 100'), 'amount'],
            'currency',
            'interval',
            'isActive',
          ],
        },
      ],
      order: ['id'],
    });

    return stripePlans;
  };

  StripeProduct.getBy = async (attr) => {
    const stripePlan = await StripeProduct.findOne({ where: { ...attr } });

    return stripePlan;
  };

  StripeProduct.updateInstance = async (id, attributes) => {
    const updatedPlan = await StripeProduct.update(attributes, {
      where: { id },
    });
    return updatedPlan;
  };

  return StripeProduct;
};
