'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Enrolments', {
      enrolmentId: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      studentId: {
          type: Sequelize.DataTypes.STRING,
          references: {
              model: {
            tableName: 'Students'
          },
              key: 'studentId'
          }
      },
      unitId: {
          type: Sequelize.DataTypes.STRING,
          references: {
              model: {
            tableName: 'Units'
          },
              key: 'unitId'
          }
      },
      semOfEnrolment: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        validate: {is: /^[Y][0-9]{4}?[S][1-2]$/i}
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Enrolments');
  }
};