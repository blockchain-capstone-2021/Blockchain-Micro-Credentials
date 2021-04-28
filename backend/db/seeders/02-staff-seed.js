'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Staff', [
      {
        staffId: 'e1234567',
        staffName: 'Ibrahim Khalil',
        passwordHash: 'ad0a463d6d74768b9766a3da5721d9a4663a00ef41971b9f96a6c6ff39bf256b'
      },
      {
        staffId: 'e2345678',
        staffName: 'Arthur Adamopoulos',
        passwordHash: '7d4179284284f897f7d29f06bc1303c3e30b3d888168d0f033ff5012698a6cde'
      },
      {
        staffId: 'e3456789',
        staffName: 'Shekhar Kalra',
        passwordHash: '9bfcac30b6fecbab0bd436ec1b44b01fe8276b7c28145b4b7b3202f354305cb6'
      },
      {
        staffId: 'e4567890',
        staffName: 'Geoff Leach',
        passwordHash: 'ab180f62d2e2d343f9ab93be8d16a695e00f29aa2902c92625c777b4dc319cd3'
      }
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Staff', null, {});
  }
};
