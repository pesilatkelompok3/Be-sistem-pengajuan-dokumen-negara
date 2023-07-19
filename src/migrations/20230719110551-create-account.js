'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Accounts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        validate: {
          notEmpty:true,
        }
      },
      username: {
        type: Sequelize.STRING,
        validate: {
          notEmpty:true,
        }
      },
      phone_number: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique:true,
        validate: {
          notEmpty:true,
          isEmail: true,
        }
      },
      password: {
        type: Sequelize.STRING,
        validate: {
          notEmpty:true,
        }
      },
      address: {
        type: Sequelize.STRING
      },
      kota: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Accounts');
  }
};