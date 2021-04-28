'use strict';
const {
  Model
} = require('sequelize');
const Student = require("./student");
const Module = require("./module");
module.exports = (sequelize, DataTypes) => {
  class Module_Attempt extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Student.belongsTo(Student)
      Student.belongsTo(Module)
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