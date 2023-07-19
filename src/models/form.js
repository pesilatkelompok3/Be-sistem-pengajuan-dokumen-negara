'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Form.hasMany(models.Submission, { foreignKey: 'form_id'});
      Form.hasMany(models.Question, { foreignKey: 'form_id'});
      Form.hasMany(models.Answer, { foreignKey: 'form_id'});
    }
  }
  Form.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Form',
  });
  return Form;
};