'use strict';
const {
    Model
} = require('sequelize');
const Degree = require("./degree");
const Enrolment = require("./enrolment");

module.exports = (sequelize, DataTypes) => {
    class Student extends Model {
        static associate(models) {
            Student.belongsTo(Degree);
            Student.hasMany(Enrolment);
            Student.hasMany(Module_Attempt);
        }
    };
    Student.init({
        studentId: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
        degreeId: DataTypes.STRING,
        studentName: DataTypes.STRING,
        studentEmail: DataTypes.STRING,
        studentCreditPoints: DataTypes.INTEGER,
        passwordHash: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Student',
    });
    return Student;
};