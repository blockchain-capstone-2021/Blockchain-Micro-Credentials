const { models } = require('../models/index');

//return all answers for a given question
async function getAnswers(questionId) {
    let _answers;

    await models.Answer.findAll({
        where: {
            questionId: questionId
        }
    }).then(answers => {
        _answers = answers;
    });

    return _answers;
}

//return an answer for a given answerId
async function getAnswer(answerId) {
    let _answer;

    await models.Answer.findByPk(answerId).then(answer => {
        _answer = answer;
    });

    return _answer;
}

//return the correct answer for a given question
async function getCorrectAnswer(questionId) {
    let _answer;

    await models.Answer.findAll({
        where: {
            questionId: questionId,
            isCorrect: true
        }
    }).then(answer => {
        _answer = answer;
    });

    return _answer;
}

//add an answer to a given question
async function addAnswerToQuestion(questionId, content, isCorrect) {
    await models.Answer.create({
        questionId: questionId,
        content: content,
        isCorrect: isCorrect
    });
}

//delete answers by question id
async function deleteAnswersOfQuestion(questionId) {
    await models.Answer.destroy({
        where: {
            questionId: questionId
        }
    });
}

//delete all answers for a given list of questions
async function deleteAllAnswers(questionIdentifiers) {
    for (const id of questionIdentifiers) {
        await deleteAnswersOfQuestion(id);
    }
}

module.exports = {
    getAnswers,
    getAnswer,
    getCorrectAnswer,
    addAnswerToQuestion,
    deleteAnswersOfQuestion,
    deleteAllAnswers
};