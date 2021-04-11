'use strict';
const Degree = require("../models/degree");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Students', {
      itudentId: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      degreeId: {
          type: Sequelize.DataTypes.INTEGER,
          references: {
              model: Degree,
              key: 'degreeId'
          }
      },
      studentName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      studentEmail: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate:{isEmail: true}
      },
      studentCreditPoints: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
      },
      passwordHash: {
        type: Sequelize.DataTypes.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Students');
  }
};