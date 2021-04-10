'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Staffs', {
      staffId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      staffName: {
        type: DataTypes.String,
        allowNull: false
      },
      passwordHash: {
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Staffs');
  }
};