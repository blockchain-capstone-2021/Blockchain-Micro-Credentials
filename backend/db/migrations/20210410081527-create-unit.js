'use strict';
const Staff = require("../models/staff");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Units', {
      untiId: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      staffId: {
          type: Sequelize.DataTypes.INTEGER,
          references: {
              model: Staff,
              key: 'staffId'
          }
      },
      unitName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      noOfModules: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
      },
      unitPassMark: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
      },
      unitCreditPoints: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Units');
  }
};