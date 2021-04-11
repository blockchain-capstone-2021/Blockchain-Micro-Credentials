'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Units', {
      unitId: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      staffId: {
          type: Sequelize.DataTypes.STRING,
          references: {
              model: {
            tableName: 'Staff'
          },
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