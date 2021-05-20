'use strict';
const {
    Model
} = require('sequelize');
const Student = require("./student");
const Module = require("./module");

module.exports = (sequelize, DataTypes) => {
    class Module_Attempt extends Model {
        static associate(models) {
            Student.belongsTo(Student);
            Student.belongsTo(Module);
        }
    };
    Module_Attempt.init({
        module_attemptId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        studentId: DataTypes.STRING,
        moduleId: DataTypes.INTEGER,
        semOfEnrolment: DataTypes.STRING,
        attemptNo: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Module_Attempt'
    });
    return Module_Attempt;
};