'use strict';
const {
    Model
} = require('sequelize');
const Unit = require("./unit");

module.exports = (sequelize, DataTypes) => {
    class Staff extends Model {
        static associate(models) {
            Staff.hasMany(Unit);
        }
    };
    Staff.init({
        staffId: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        staffName: DataTypes.STRING,
        passwordHash: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Staff',
        freezeTableName: true
    });
    return Staff;
};