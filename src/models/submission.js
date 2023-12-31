'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Submission extends Model {
    
    static associate(models) {
      Submission.belongsTo(models.Account, { foreignKey: 'user_id' })
      Submission.hasMany(models.Answer, { foreignKey: "submission_id" });
      Submission.hasMany(models.Comment, { foreignKey: "submission_id" });
    }
  }
  Submission.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      user_id: DataTypes.STRING,
      user_name: DataTypes.STRING,
      form_id: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Submission",
    }
  );
  return Submission;
};