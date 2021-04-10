"use strict";
const { Model } = require("sequelize");
const Module = require("./module");
const Answer = require("./answer");
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Question.belongsTo(Module)
        Question.hasMany(Answer)
    }
  }
  Question.init(
    {
        questionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        moduleId: {
            type: DataTypes.INTEGER,
            references: {
                model: Module,
                key: 'moduleId'
            }
        },
        data: {
           type: DataTypes.TEXT,
           allowNull: false
        },
    },
    {
      sequelize,
      modelName: "Question",
    }
  );

  return Question;
};
