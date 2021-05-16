'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Answers', {
            answerId: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true
            },
            questionId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'Questions'
                    },
                    key: 'questionId'
                }
            },
            content: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: false
            },
            isCorrect: {
                type: Sequelize.DataTypes.BOOLEAN,
                allowNull: false
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Answers');
    }
};