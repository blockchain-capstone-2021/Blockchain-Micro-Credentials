'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Staff', {
      staffId: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      staffName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      passwordHash: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Staff');
  }
};