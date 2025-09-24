'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.StockMovement, {
        foreignKey: 'userId',
        as: 'stockMovements'
      });
    }
  }

  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true, len: [2, 255] }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
      validate: { isEmail: true }
    },
    faceDescriptor: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'face_descriptor'
    },
    profilePhoto: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'profile_photo'
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    underscored: true
  });

  return User;
};
