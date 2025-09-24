'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      Item.hasMany(models.StockMovement, {
        foreignKey: 'itemId',
        as: 'stockMovements'
      });
    }
  }

  Item.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [2, 255] }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    barcode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true
    },
    qrCode: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
      field: 'qr_code'
    },
    category: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    currentQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
      field: 'current_quantity'
    },
    minQuantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: { min: 0 },
      field: 'min_quantity'
    }
  }, {
    sequelize,
    modelName: 'Item',
    tableName: 'Items',
    underscored: true
  });

  return Item;
};
