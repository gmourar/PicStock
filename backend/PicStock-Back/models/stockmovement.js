'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StockMovement extends Model {
    static associate(models) {
      StockMovement.belongsTo(models.Item, {
        foreignKey: 'itemId',
        as: 'item'
      });
      StockMovement.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
    }
  }

  StockMovement.init({
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Items', key: 'id' },
      field: 'item_id'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'Users', key: 'id' },
      field: 'user_id'
    },
    movementType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: { isIn: [['IN', 'OUT']] },
      field: 'movement_type'
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'StockMovement',
    tableName: 'StockMovements',
    underscored: true
  });

  return StockMovement;
};
