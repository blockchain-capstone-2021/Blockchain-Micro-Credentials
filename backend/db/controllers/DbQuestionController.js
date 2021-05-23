const { models } = require('../models/index');

//returns a given number of randomised questions for a given module
async function getRandomizedQuestions(moduleId, noOfQuestions) {
    let questions = await getQuestions(moduleId);
    let returnQuestions = [];

    for (var i = 1; i <= noOfQuestions; i++) {
        var index = Math.floor(Math.random() * (questions.length - 1) + 0);
        let question = questions[index];
        questions.splice(index, 1);
        returnQuestions.push(question);
    }
    return returnQuestions;
}

//returns all questions for a given module
async function getQuestions(moduleId) {
    let _questions;

    await models.Question.findAll({
        where: {
            moduleId: moduleId
        }
    }).then(questions => {
        _questions = questions;
    });

    return _questions;
}

//returns a question for a given questionId
async function getQuestion(questionId) {
    let _question;

    await models.Question.findByPk(questionId).then(question => {
        _question = question;
    });

    return _question;
}

//returns number of questions for a given module
async function getQuestionsCount(moduleId) {

    const count = await models.Question.count({
        where: {
            moduleId: moduleId
        }
    });

    return count;
}

//adds a new question to a given module
async function addQuestionToModule(moduleId, content) {
    let questionId;
    await models.Question.create({
        moduleId: moduleId,
        content: content
    }).then(question => {
        questionId = question.questionId;
    });

    return questionId;
}

//delete question by question id
async function deleteQuestion(questionId) {
    await models.Question.destroy({
        where: {
            questionId: questionId
        }
    });
}

//delete all questions for a given module
async function deleteAllQuestions(moduleId) {
    await models.Question.destroy({
        where: {
            moduleId: moduleId
        }
    });
}

module.exports = {
    getRandomizedQuestions,
    getQuestions,
    getQuestion,
    addQuestionToModule,
    getQuestionsCount,
    deleteQuestion,
    deleteAllQuestions
};