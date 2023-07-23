"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static associate(models) {
      Account.hasMany(models.Submission, { foreignKey: "user_id" });
    }
  }
  Account.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      nip: DataTypes.STRING,
      name: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      email: DataTypes.STRING,
      birth_date: DataTypes.STRING,
      gender: DataTypes.STRING,
      password: DataTypes.STRING,
      address: DataTypes.STRING,
      role: DataTypes.STRING,
      refresh_token: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Account",
    }
  );
  return Account;
};
