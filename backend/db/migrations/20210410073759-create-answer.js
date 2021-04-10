'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Answers', {
      answerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      questionId: {
          type: DataTypes.INTEGER,
          references: {
              model: Question,
              key: 'questionId'
          }
      },
      content: {
          type: DataTypes.TEXT,
          allowNull: false
      },
      isCorrect :{
          type: DataTypes.BOOLEAN,
          allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Answers');
  }
};