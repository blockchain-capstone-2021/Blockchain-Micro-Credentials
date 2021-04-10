"use strict";
const { Model } = require("sequelize");
const Degree = require("./degree");
const Enrolment = require("./enrolment");
const StudentLogin = require("./studentLogin");
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        Student.belongsTo(Degree)
        Student.hasMany(Enrolment)
        Student.hasOne(StudentLogin)
    }
  }
  Student.init(
    {
        studentId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        degreeId: {
            type: DataTypes.INTEGER,
            references: {
                model: Degree,
                key: 'degreeId'
            }
        },
        studentName: {
           type: DataTypes.STRING,
           allowNull: false
        },
        studentEmail: {
          type: DataTypes.STRING,
          allowNull: false
       },
        studentCreditPoints: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
      sequelize,
      modelName: "Student",
    }
  );

  return Student;
};
