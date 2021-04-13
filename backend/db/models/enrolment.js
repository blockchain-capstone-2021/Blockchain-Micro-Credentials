'use strict';
const {
  Model
} = require('sequelize');
const Unit = require("./unit");
const Student = require("./student");
module.exports = (sequelize, DataTypes) => {
  class Enrolment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Enrolment.belongsTo(Unit)
      Enrolment.belongsTo(Student)
    }
  };
  Enrolment.init({
    enrolmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    studentId: DataTypes.STRING,
    unitId: DataTypes.STRING,
    semOfEnrolment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Enrolment',
  });
  return Enrolment;
};