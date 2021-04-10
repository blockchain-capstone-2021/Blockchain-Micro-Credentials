"use strict";
const { Model } = require("sequelize");
const Staff = require("./staff");
module.exports = (sequelize, DataTypes) => {
  class StaffLogin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        StaffLogin.belongsTo(Staff)
    }
  }
  StaffLogin.init(
    {
      loginId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      staffId: {
          type: DataTypes.INTEGER,
          references: {
              model: Staff,
              key: 'staffId'
          }
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "StaffLogin",
    }
  );

  return StaffLogin;
};
