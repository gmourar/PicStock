'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'João Silva',
        email: 'joao@empresa.com',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Maria Santos',
        email: 'maria@empresa.com',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Pedro Oliveira',
        email: 'pedro@empresa.com',
        active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
