'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Unit.belongsTo(Staff)
      Unit.hasMany(Module)
      Unit.hasMany(Enrolment)
    }
  };
  Unit.init({
    unitId: DataTypes.STRING,
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