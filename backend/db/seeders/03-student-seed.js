'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Students', [
      {
        studentId: 's3541003',
        degreeId: 'BP094',
        studentName: 'Jack Swallow',
        studentEmail: 's3541003@student.rmit.edu.au',
        studentCreditPoints: '264',
        passwordHash: 'd1af871f48c9a941c688c6763bd214aeae0a7796f8e3f039cba4f85d92101cd4'
      },
      {
        studentId: 's3710669',
        degreeId: 'BP094',
        studentName: 'Shrey Parekh',
        studentEmail: 's3710669@student.rmit.edu.au',
        studentCreditPoints: '252',
        passwordHash: '82d2baa89202f91e179e784828ac0d8f42093b8f1232c09b03401329bd238d8a'
      },
      {
        studentId: 's1234567',
        degreeId: 'BP096',
        studentName: 'John Smith',
        studentEmail: 's3541003@student.rmit.edu.au', //Jack's email
        studentCreditPoints: '0',
        passwordHash: '8bb0cf6eb9b17d0f7d22b456f121257dc1254e1f01665370476383ea776df414'
      },
      {
        studentId: 's2345678',
        degreeId: 'BP096',
        studentName: 'Jane Doe',
        studentEmail: 's3710669@student.rmit.edu.au', //Shrey's email
        studentCreditPoints: '36',
        passwordHash: '0c08a9536b5dd78713f440acb930872fd69f7a71ad0cf9cdedc9628ddf9ac3d7'
      },
      {
        studentId: 's3745409',
        degreeId: 'BP094',
        studentName: 'Daniel Dominique',
        studentEmail: 's3745409@student.rmit.edu.au',
        studentCreditPoints: '84',
        passwordHash: '37653276b74d7442c60db2c26eef32c21b0d121ade2ce826f4d1dc1d3c1e025f'
      },
      {
        studentId: 's3724266',
        degreeId: 'BP094',
        studentName: 'Shreya Samanta',
        studentEmail: 's3724266@student.rmit.edu.au',
        studentCreditPoints: '276',
        passwordHash: '45736204d1a6d8136d9b9bb626453b9f580c076ff98f202849391a9395d429f4'
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Students', null, {});
  }
};
