'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Degrees', {
      degreeId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      degreeName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      totalCreditPoints: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      creditPointsPerSem: {
          type: DataTypes.INTEGER,
          allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Degrees');
  }
};