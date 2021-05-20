'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {

        var seedData = [];
        var questionCounter = 1;
        for (let q = 1; q <= 1080; q++) {
            var correctAnswer = Math.floor(Math.random() * (4) + 1);
            for (let a = 1; a <= 4; a++) {
                let correct;
                let correctMessage;
                if (a == correctAnswer) {
                    correct = true;
                    correctMessage = "correct";
                } else {
                    correct = false;
                    correctMessage = "incorrect";
                }
                const data = {
                    questionId: q,
                    content: `This is example answer ${a} for question ${questionCounter}, this answer is ${correctMessage}`,
                    isCorrect: correct
                };
                seedData.push(data);
            }
            questionCounter++;
            if (questionCounter > 30) {
                questionCounter = 1;
            }
        }
        return queryInterface.bulkInsert('Answers', seedData);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Answers', null, {});
    }
};
