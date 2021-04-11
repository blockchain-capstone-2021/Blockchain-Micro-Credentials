'use strict';
const {
  Model
} = require('sequelize');
const Unit = require("./unit");
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Staff.hasMany(Unit)
    }
  };
  Staff.init({
    staffId: DataTypes.STRING,
    staffName: DataTypes.STRING,
    passwordHash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Staff',
  });
  return Staff;
};