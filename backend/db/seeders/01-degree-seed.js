'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Degrees', [
            {
                degreeId: 'BP094',
                degreeName: 'Bachelor of Computer Science',
                totalCreditPoints: 288,
                creditPointsPerSem: 48
            },
            {
                degreeId: 'BP096',
                degreeName: 'Bachelor of Software Engineering',
                totalCreditPoints: 384,
                creditPointsPerSem: 48
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Degrees', null, {});
    }
};
