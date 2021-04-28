'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Enrolments', [
      //Jack
      {
        studentId: 's3541003',
        unitId: 'COSC2536',
        semOfEnrolment: 'Y2021S1'
      },
      {
        studentId: 's3541003',
        unitId: 'COSC1186',
        semOfEnrolment: 'Y2021S1'
      },
      //Shrey
      {
        studentId: 's3710669',
        unitId: 'COSC2536',
        semOfEnrolment: 'Y2021S1'
      },
      {
        studentId: 's3710669',
        unitId: 'COSC1186',
        semOfEnrolment: 'Y2021S1'
      },
      {
        studentId: 's3710669',
        unitId: 'INTE2554',
        semOfEnrolment: 'Y2021S1'
      },
      //John
      {
        studentId: 's1234567',
        unitId: 'COSC2536',
        semOfEnrolment: 'Y2021S1'
      },
      {
        studentId: 's1234567',
        unitId: 'COSC1186',
        semOfEnrolment: 'Y2021S1'
      },
      {
        studentId: 's1234567',
        unitId: 'INTE2554',
        semOfEnrolment: 'Y2021S1'
      },
      {
        studentId: 's1234567',
        unitId: 'COSC2277',
        semOfEnrolment: 'Y2021S1'
      },
      //Jane
      {
        studentId: 's2345678',
        unitId: 'COSC2536',
        semOfEnrolment: 'Y2021S1'
      },
      {
        studentId: 's2345678',
        unitId: 'COSC1186',
        semOfEnrolment: 'Y2021S1'
      },
      {
        studentId: 's2345678',
        unitId: 'INTE2554',
        semOfEnrolment: 'Y2021S1'
      },
      {
        studentId: 's2345678',
        unitId: 'COSC2277',
        semOfEnrolment: 'Y2021S1'
      },
      //Daniel
      {
        studentId: 's3745409',
        unitId: 'COSC2536',
        semOfEnrolment: 'Y2021S1'
      },
      {
        studentId: 's3745409',
        unitId: 'COSC1186',
        semOfEnrolment: 'Y2021S1'
      },
      {
        studentId: 's3745409',
        unitId: 'INTE2554',
        semOfEnrolment: 'Y2021S1'
      },
      {
        studentId: 's3745409',
        unitId: 'COSC2277',
        semOfEnrolment: 'Y2021S1'
      },
      //Shreya
      {
        studentId: 's3724266',
        unitId: 'COSC2536',
        semOfEnrolment: 'Y2021S1'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Enrolments', null, {});
  }
};
