"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudentLogin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        StudentLogin.belongsTo(Student)
    }
  }
  StudentLogin.init(
    {
      loginId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      studentId: {
          type: DataTypes.INTEGER,
          references: {
              model: Student,
              key: 'studentId'
          }
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "StudentLogin",
    }
  );

  return StudentLogin;
};
