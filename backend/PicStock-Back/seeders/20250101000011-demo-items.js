'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Items', [
      {
        name: 'Notebook Dell Inspiron 15',
        description: 'Notebook para uso corporativo, 8GB RAM, 256GB SSD',
        barcode: '1234567890123',
        qr_code: 'ITEM001',
        category: 'Informática',
        current_quantity: 5,
        min_quantity: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Mouse Logitech MX Master 3',
        description: 'Mouse sem fio ergonômico',
        barcode: '2234567890123',
        qr_code: 'ITEM002',
        category: 'Periféricos',
        current_quantity: 10,
        min_quantity: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Monitor LG 24" Full HD',
        description: 'Monitor LED 24 polegadas 1920x1080',
        barcode: '3234567890123',
        qr_code: 'ITEM003',
        category: 'Monitores',
        current_quantity: 8,
        min_quantity: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Teclado Mecânico Corsair K95',
        description: 'Teclado mecânico RGB com switches Cherry MX',
        barcode: '4234567890123',
        qr_code: 'ITEM004',
        category: 'Periféricos',
        current_quantity: 3,
        min_quantity: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Items', null, {});
  }
};
