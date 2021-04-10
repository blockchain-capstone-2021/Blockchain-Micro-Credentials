"use strict";
const { Model } = require("sequelize");
const Unit = require("./unit");
const StaffLogin = require("./staffLogin");
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Staff.hasMany(Unit)
        Staff.hasOne(StaffLogin)
    }
  }
  Staff.init(
    {
        staffId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        staffName: {
           type: DataTypes.String,
           allowNull: false
        }
    },
    {
      sequelize,
      modelName: "Staff",
    }
  );

  return Staff;
};
