'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Modules', {
      moduleId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      unitId: {
          type: Sequelize.DataTypes.INTEGER,
          references: {
              model: Unit,
              key: 'unitId'
          }
      },
      moduleName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      moduleNo: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
      },
      noOfQuestions: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Modules');
  }
};