"use strict";
const argon2 = require("argon2");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isSuperAdmin = [
      {
        id: "superAdmin1",
        nip: "123457844754",
        name: "Super Admin",
        email: "admin@gmail.com",
        password: await argon2.hash("12345678"),
        role: "SuperAdmin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await queryInterface.bulkInsert("Accounts", isSuperAdmin);
  },

  async down(queryInterface, Sequelize) {
    // Tambahkan perintah penghapusan seeder di sini jika diperlukan.
    // Misalnya: await queryInterface.bulkDelete('Accounts', null, {});
  },
};
