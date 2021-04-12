'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Students', [
      {
        studentId: 's3541003',
        degreeId: 'BP094',
        studentName: 'Jack Swallow',
        studentEmail: 's3541003@student.rmit.edu.au',
        studentCreditPoints: '252',
        passwordHash: '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4'
      },
      {
        studentId: 's3710669',
        degreeId: 'BP094',
        studentName: 'Shrey Parekh',
        studentEmail: 's3710669@student.rmit.edu.au',
        studentCreditPoints: '264',
        passwordHash: 'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Students', null, {});
  }
};
