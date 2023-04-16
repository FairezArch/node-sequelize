'use strict';
let bcrypt = require("bcrypt");
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
      username: 'Angga',
      email: 'angga@example.net',
      password: await bcrypt.hash('angga123', 10),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    }, {
      username: 'Angga2',
      email: 'angga2@example.net',
      password: await bcrypt.hash('angga2123', 10),
      created_at: new Date(),
      updated_at: new Date(),
      deleted_at: null
    }]

    await queryInterface.bulkInsert('users', data, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
