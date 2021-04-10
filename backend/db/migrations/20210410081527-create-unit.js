'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Units', {
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Units');
  }
};