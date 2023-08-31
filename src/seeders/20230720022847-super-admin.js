"use strict";
const argon2 = require("argon2");
const { nanoid } = require("nanoid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const isSuperAdmin = [
      {
        id: `SuperAdmin-${nanoid(12)}`,
        nip: "123457844754",
        name: "Super Admin",
        email: "superadmin@gmail.com",
        password: await argon2.hash("DidYouKnow!727"),
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
