'use strict';
const {
  Model
} = require('sequelize');
const Degree = require("./degree");
const Enrolment = require("./enrolment");
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Student.belongsTo(Degree)
      Student.hasMany(Enrolment)
    }
  };
  Student.init({
    studentId: DataTypes.STRING,
    degreeId: DataTypes.INTEGER,
    studentName: DataTypes.STRING,
    studentEmail: DataTypes.STRING,
    passwordHash: DataTypes.STRING,
    studentCreditPoints: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Student',
  });
  return Student;
};