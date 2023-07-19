'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Answers", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      submission_id: {
        type: Sequelize.STRING,
        references: {
          model: "Submission",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      question_id: {
        type: Sequelize.STRING,
        references: {
          model: "Questions",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      input: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Answers');
  }
};