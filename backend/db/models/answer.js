"use strict";
const { Model } = require("sequelize");
const Question = require("./question");
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Answer.belongsTo(Question, {
        as: "owner",
        foreignKey: "questionId",
        onDelete: "CASCADE",
      });
    }
  }
  Answer.init(
    {
      questionId: DataTypes.INTEGER,
      data: DataTypes.TEXT,
      isCorrect: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Answer",
    }
  );



  return Answer;
};
