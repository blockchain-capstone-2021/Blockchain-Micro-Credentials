"use strict";
const { Model } = require("sequelize");
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
  }
  Unit.init(
    {
        untiId: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        staffId: {
            type: DataTypes.INTEGER,
            references: {
                model: Staff,
                key: 'staffId'
            }
        },
        unitName: {
           type: DataTypes.STRING,
           allowNull: false
        },
        noOfModules: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        unitPassMark: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        unitCreditPoints: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
      sequelize,
      modelName: "Unit",
    }
  );

  return Unit;
};
