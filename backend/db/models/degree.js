'use strict';
const {
  Model
} = require('sequelize');
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
    degreeId: DataTypes.STRING,
    degreeName: DataTypes.STRING,
    totalCreditPoints: DataTypes.INTEGER,
    creditPointsPerSem: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Degree',
  });
  return Degree;
};