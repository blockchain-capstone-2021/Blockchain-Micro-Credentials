'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Module_Attempts', {
            module_attemptId: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            studentId: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'Students'
                    },
                    key: 'studentId'
                }
            },
            moduleId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'Modules'
                    },
                    key: 'moduleId'
                }
            },
            semOfEnrolment: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
                validate: { is: /^[Y][0-9]{4}?[S][1-2]$/i }
            },
            attemptNo: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Module_Attempts');
    }
};