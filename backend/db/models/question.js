'use strict';
const {
    Model
} = require('sequelize');
const Module = require("./module");
const Answer = require("./answer");

module.exports = (sequelize, DataTypes) => {
    class Question extends Model {
        static associate(models) {
            Question.belongsTo(Module);
            Question.hasMany(Answer);
        }
    };
    Question.init({
        questionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        moduleId: DataTypes.INTEGER,
        content: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Question',
    });
    return Question;
};