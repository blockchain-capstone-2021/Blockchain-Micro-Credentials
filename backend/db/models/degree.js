'use strict';
const {
  Model
} = require('sequelize');
const Student = require("./student");
module.exports = (sequelize, DataTypes) => {
  class Degree extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Degree.hasMany(Student)
    }
  };
  Degree.init({
    degreeId: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    degreeName: DataTypes.STRING,
    totalCreditPoints: DataTypes.INTEGER,
    creditPointsPerSem: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Degree',
  });
  return Degree;
};