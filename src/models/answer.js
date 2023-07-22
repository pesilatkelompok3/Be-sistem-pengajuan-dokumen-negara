'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    static associate(models) {
      Answer.belongsTo(models.Submission, { foreignKey: 'submission_id' });
      Answer.belongsTo(models.Question, { foreignKey: 'question_id' });
    }
  }
  Answer.init({
    submission_id: DataTypes.STRING,
    question_id: DataTypes.STRING,
    input: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Answer',
  });
  return Answer;
};