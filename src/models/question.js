"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    static associate(models) {
      Question.belongsTo(models.Form, { foreignKey: "form_id" });
    }
  }
  Question.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      form_id: DataTypes.STRING,
      title_field: DataTypes.STRING,
      type: DataTypes.STRING,
      required: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Question",
    }
  );
  return Question;
};
