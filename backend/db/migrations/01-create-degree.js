'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Degrees', {
      degreeId: {
        type: Sequelize.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        validate:{isUppercase: true}
      },
      degreeName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
      },
      totalCreditPoints: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
      },
      creditPointsPerSem: {
          type: Sequelize.DataTypes.INTEGER,
          allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Degrees');
  }
};