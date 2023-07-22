'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    static associate(models) {
      Form.hasMany(models.Submission, { foreignKey: 'form_id'});
      Form.hasMany(models.Question, { foreignKey: 'form_id'});
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