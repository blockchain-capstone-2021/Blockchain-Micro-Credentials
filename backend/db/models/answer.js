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
        Answer.belongsTo(Question)
    }
  }
  Answer.init(
    {
      answerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      questionId: {
          type: DataTypes.INTEGER,
          references: {
              model: Question,
              key: 'questionId'
          }
      },
      data: {
          type: DataTypes.TEXT,
          allowNull: false
      },
      isCorrect :{
          type: DataTypes.BOOLEAN,
          allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Answer",
    }
  );

  return Answer;
};
