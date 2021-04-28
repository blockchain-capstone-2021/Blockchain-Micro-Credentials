'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Modules', [
      {
        unitId: 'COSC2536',
        moduleName: 'Security in IT Module 1',
        moduleNo: 1,
        noOfQuestions: 10,
        published: true,
        weight: 10
      },
      {
        unitId: 'COSC2536',
        moduleName: 'Security in IT Module 2',
        moduleNo: 2,
        noOfQuestions: 10,
        published: true,
        weight: 10
      },
      {
        unitId: 'COSC2536',
        moduleName: 'Security in IT Module 3',
        moduleNo: 3,
        noOfQuestions: 10,
        published: true,
        weight: 10
      },
      {
        unitId: 'COSC2536',
        moduleName: 'Security in IT Module 4',
        moduleNo: 4,
        noOfQuestions: 10,
        published: true,
        weight: 10
      },
      {
        unitId: 'COSC2536',
        moduleName: 'Security in IT Module 5',
        moduleNo: 5,
        noOfQuestions: 10,
        published: true,
        weight: 10
      },
      {
        unitId: 'COSC2536',
        moduleName: 'Security in IT Module 6',
        moduleNo: 6,
        noOfQuestions: 10,
        published: true,
        weight: 10
      },
      {
        unitId: 'COSC2536',
        moduleName: 'Security in IT Module 7',
        moduleNo: 7,
        noOfQuestions: 10,
        published: true,
        weight: 10
      },
      {
        unitId: 'COSC2536',
        moduleName: 'Security in IT Module 8',
        moduleNo: 8,
        noOfQuestions: 10,
        published: true,
        weight: 10
      },
      {
        unitId: 'COSC2536',
        moduleName: 'Security in IT Module 9',
        moduleNo: 9,
        noOfQuestions: 10,
        published: true,
        weight: 10
      },
      { 
        unitId: 'COSC2536',
        moduleName: 'Security in IT Module 10',
        moduleNo: 10,
        noOfQuestions: 10,
        published: true,
        weight: 10
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Modules', null, {});
  }
};
