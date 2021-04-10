'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Modules', {
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Modules');
  }
};