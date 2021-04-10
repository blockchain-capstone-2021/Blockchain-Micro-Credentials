"use strict";
const { Model } = require("sequelize");
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
  }
  Module.init(
    {
        moduleId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        unitId: {
            type: DataTypes.INTEGER,
            references: {
                model: Unit,
                key: 'unitId'
            }
        },
        moduleName: {
           type: DataTypes.STRING,
           allowNull: false
        },
        moduleNo: {
            type: DataTypes.INT,
            allowNull: false
        },
        noOfQuestions: {
            type: DataTypes.INT,
            allowNull: false
        }
    },
    {
      sequelize,
      modelName: "Module",
    }
  );

  return Module;
};
