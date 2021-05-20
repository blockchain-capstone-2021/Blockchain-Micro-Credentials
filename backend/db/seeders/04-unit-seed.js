'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Units', [
            {
                unitId: 'COSC2536',
                staffId: 'e1234567',
                unitName: 'Security in Computing and Information Technology',
                noOfModules: 10,
                unitPassMark: 50,
                unitCreditPoints: 12,
            },
            {
                unitId: 'INTE2554',
                staffId: 'e2345678',
                unitName: 'Blockchain Applications and Smart Contracts',
                noOfModules: 12,
                unitPassMark: 50,
                unitCreditPoints: 12,
            },
            {
                unitId: 'COSC2277',
                staffId: 'e3456789',
                unitName: 'Web Development Technologies',
                noOfModules: 8,
                unitPassMark: 50,
                unitCreditPoints: 12,
            },
            {
                unitId: 'COSC1186',
                staffId: 'e4567890',
                unitName: 'Interactive 3D Graphics and Animation',
                noOfModules: 6,
                unitPassMark: 50,
                unitCreditPoints: 12,
            }
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Units', null, {});
    }
};
