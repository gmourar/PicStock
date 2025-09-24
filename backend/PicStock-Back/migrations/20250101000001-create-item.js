'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Items', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      barcode: {
        type: Sequelize.STRING,
        unique: true
      },
      qr_code: {
        type: Sequelize.STRING,
        unique: true
      },
      category: {
        type: Sequelize.STRING(100)
      },
      current_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      min_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('Items', ['barcode']);
    await queryInterface.addIndex('Items', ['qr_code']);
    await queryInterface.addIndex('Items', ['category']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Items');
  }
};
