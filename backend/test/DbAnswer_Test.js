const assert = require('assert');

const sequelizeMock = require('sequelize-mock');
const answer = require("../db/models/answer");
var DBConnectionMock = new sequelizeMock;

//Create a mock instance of a Answer
var AnswerMock = DBConnectionMock.define('answers', {
    questionId: 1,
    content: "testAnswer1",
    isCorrect: false
});

describe('DbAnswerController', () => {
    //Get the answer given an answer id.
    describe('getAnswer()', () => {
        it('should return the answer with the correct answerId', async () => {
            let expectedAnswerId = 1;
            let actualAnswer = await getAnswer(expectedAnswerId);
            let actualAnswerId = actualAnswer.id;
            assert.strictEqual(actualAnswerId, expectedAnswerId);
        }).timeout(10000);
    });
    //Get the correct answer of a given question Id
    describe('getCorrectAnswer()', () => {
        it('should return the correct answer for a given questionId', async () => {
            let questionId = 1;
            let answers = await getCorrectAnswer(questionId);
            let answer = answers[0];
            assert.strictEqual(answer.questionId, questionId);
            assert.strictEqual(answer.isCorrect, true);
        });
    });
    //Add an answer to the table and see if the answer when returned if correct
    describe('addAnswerToQuestion()', () => {
        it('should add the given answer to the given question', async () => {
            let questionId = 1;
            let content = "testAnswer6";
            let isCorrect = false;
            let answer = await addAnswerToQuestion(questionId, content, isCorrect);
            assert.strictEqual(questionId, answer.questionId);
            assert.strictEqual(content, answer.content);
            assert.strictEqual(isCorrect, answer.isCorrect);
        });
    });

});

//return an answer for a given answerId
async function getAnswer(_answerId) {
    let _answer;

    await AnswerMock.findOne({
        where: {
            answerId: _answerId
        }
    }).then(answer => {
        _answer = answer;
    });

    return _answer;
}

//return the correct answer for a given question
async function getCorrectAnswer(_questionId) {
    let _answer;

    await AnswerMock.findAll({
        where: {
            questionId: _questionId,
            isCorrect: true
        }
    }).then(answer => {
        _answer = answer;
    });

    return _answer;
}

//add an answer to a given question
async function addAnswerToQuestion(_questionId, _content, _isCorrect) {
    let instance;
    await AnswerMock.create({
        questionId: _questionId,
        content: _content,
        isCorrect: _isCorrect
    }).then(answer => {
        instance = answer;
    });

    return instance;
}
