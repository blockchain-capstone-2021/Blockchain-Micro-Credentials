'use strict';
const Module = require("./module");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Questions', {
      questionId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      moduleId: {
          type: Sequelize.DataTypes.INTEGER,
          references: {
              model: Module,
              key: 'moduleId'
          }
      },
      content: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Questions');
  }
};