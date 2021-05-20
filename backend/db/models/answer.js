'use strict';
const {
    Model
} = require('sequelize');
const Question = require("./question");

module.exports = (sequelize, DataTypes) => {
    class Answer extends Model {
        static associate(models) {
            Answer.belongsTo(Question);
        }
    };
    Answer.init({
        answerId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        questionId: DataTypes.INTEGER,
        content: DataTypes.STRING,
        isCorrect: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'Answer',
    });
    return Answer;
};