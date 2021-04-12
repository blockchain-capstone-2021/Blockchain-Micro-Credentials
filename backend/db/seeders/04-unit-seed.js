'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Units', [{
      unitId: 'COSC2536',
      staffId: 'e1234567',
      unitName: 'Security in Computing and Information Technology',
      noOfModules:10,
      unitPassMark:50,
      unitCreditPoints:12,
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Units', null, {});
  }
};
