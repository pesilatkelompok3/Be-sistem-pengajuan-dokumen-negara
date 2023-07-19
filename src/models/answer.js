'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Answer.belongsTo(models.Account, { foreignKey: 'user_id' });
      Answer.belongsTo(models.Question, { foreignKey: 'question_id' });
    }
  }
  Answer.init({
    user_id: DataTypes.STRING,
    question_id: DataTypes.STRING,
    input: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Answer',
  });
  return Answer;
};