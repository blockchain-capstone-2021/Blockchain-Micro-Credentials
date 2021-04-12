'use strict';
const {
  Model
} = require('sequelize');
const Unit = require("./unit");
const Question = require("./question");
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Module.belongsTo(Unit)
      Module.hasMany(Question)
    }
  };
  Module.init({
    moduleId: DataTypes.INTEGER,
    unitId: DataTypes.STRING,
    moduleName: DataTypes.STRING,
    moduleNo: DataTypes.INTEGER,
    noOfQuestions: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Module',
  });
  return Module;
};