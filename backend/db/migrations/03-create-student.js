'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Students', {
            studentId: {
                type: Sequelize.DataTypes.STRING,
                primaryKey: true,
                allowNull: false,
                validate: { isLowercase: true }
            },
            degreeId: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'Degrees'
                    },
                    key: 'degreeId'
                }
            },
            studentName: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            studentEmail: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                validate: { isEmail: true }
            },
            studentCreditPoints: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            passwordHash: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Students');
    }
};