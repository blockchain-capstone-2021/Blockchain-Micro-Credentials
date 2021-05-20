'use strict';
const {
    Model
} = require('sequelize');
const Staff = require("./staff");
const Module = require("./module");
const Enrolment = require("./enrolment");

module.exports = (sequelize, DataTypes) => {
    class Unit extends Model {
        static associate(models) {
            Unit.belongsTo(Staff);
            Unit.hasMany(Module);
            Unit.hasMany(Enrolment);
        }
    };
    Unit.init({
        unitId: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        staffId: DataTypes.STRING,
        unitName: DataTypes.STRING,
        noOfModules: DataTypes.INTEGER,
        unitPassMark: DataTypes.INTEGER,
        unitCreditPoints: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'Unit',
    });
    return Unit;
};