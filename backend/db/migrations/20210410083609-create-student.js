'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Students', {
      itudentId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      degreeId: {
          type: DataTypes.INTEGER,
          references: {
              model: Degree,
              key: 'degreeId'
          }
      },
      studentName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      studentEmail: {
        type: DataTypes.STRING,
        allowNull: false,
        validate:{isEmail: true}
      },
      studentCreditPoints: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      passwordHash: {
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Students');
  }
};