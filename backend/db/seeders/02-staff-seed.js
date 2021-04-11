'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Staff', [{
      staffId: 'e1234567',
      staffName: 'Ibrahim Khalil',
      passwordHash: 'a7adfab2f06120ceaee442c5632ec872151890a87e75fc20210c9f684b0b25ac'
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Staff', null, {});
  }
};
