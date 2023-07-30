"use strict";
const fs = require("fs");
const path = require("path");
const { Account } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const filePath = path.join(__dirname, "../data/Account.json");

    let data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    data.forEach((element) => {
      element.createdAt = new Date();
      element.updatedAt = new Date();
    });
    await Account.bulkCreate(data);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Accounts", null);
  },
};
