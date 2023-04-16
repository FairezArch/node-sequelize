'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let data = [{
      name: 'Bolang',
      user_id: 1,
      created_at: new Date,
      updated_at: new Date,
      deleted_at: null
    }, {
      name: 'Petualang Panji',
      user_id: 1,
      created_at: new Date,
      updated_at: new Date,
      deleted_at: null
    }]
    await queryInterface.bulkInsert('books', data, {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('books', null, {})

  }
};
