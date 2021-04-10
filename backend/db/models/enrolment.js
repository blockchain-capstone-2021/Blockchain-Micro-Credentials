'use strict';
const {
  Model
} = require('sequelize');
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
    enrolmentId: DataTypes.STRING,
    unitId: DataTypes.INTEGER,
    studentId: DataTypes.STRING,
    semOfEnrolment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Enrolment',
  });
  return Enrolment;
};