'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Enrolments', [
      {
        studentId: 's3541003',
        unitId: 'COSC2536',
        semOfEnrolment: 'Y2021S1'
      },
      {
        studentId: 's3710669',
        unitId: 'COSC2536',
        semOfEnrolment: 'Y2021S1'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Enrolments', null, {});
  }
};
