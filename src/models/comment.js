"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.Submission, { foreignKey: "submission_id" });
    }
  }
  Comment.init(
    {
      submission_id: DataTypes.STRING,
      comment_input: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comment",
    }
  );
  return Comment;
};
