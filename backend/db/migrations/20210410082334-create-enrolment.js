'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Enrolments', {
      enrolmentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      studentId: {
          type: DataTypes.INTEGER,
          references: {
              model: Student,
              key: 'studentId'
          }
      },
      unitId: {
          type: DataTypes.INTEGER,
          references: {
              model: Unit,
              key: 'unitId'
          }
      },
      semOfEnrolment: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {is: /^[Y][0-9]{4}?[S][1-2]$/i}
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Enrolments');
  }
};