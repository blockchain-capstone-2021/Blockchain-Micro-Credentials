const assert = require('assert');

const sequelizeMock = require('sequelize-mock')
var DBConnectionMock = new sequelizeMock

var AnswerMock = DBConnectionMock.define('answers', {
    questionId: 1,
    content: "testAnswer1",
    isCorrect: false
});

describe('DbAnswerController', () => {

    describe('getAnswer()', () =>{
        it('should return the answer with the correct answerId', async () => {
            let expectedAnswerId = 1
            let actualAnswer = await getAnswer(expectedAnswerId)
            let actualAnswerId = actualAnswer.id
            assert.strictEqual(actualAnswerId, expectedAnswerId)
        }).timeout(10000);
    })

    describe('getCorrectAnswer()', () =>{
        it('should return the correct answer for a given questionId', async () => {
            let questionId = 1
            let answers = await getCorrectAnswer(questionId)
            let answer = answers[0]
            assert.strictEqual(answer.questionId, questionId)
            assert.strictEqual(answer.isCorrect, true)
        })
    })

    describe('addAnswerToQuestion()', () =>{
        it('should add the given answer to the given question', async () =>{
            let questionId = 1
            let content = "testAnswer6"
            let isCorrect = false
            answer = await addAnswerToQuestion(questionId, content, isCorrect)
            assert.strictEqual(questionId, answer.questionId)
            assert.strictEqual(content, answer.content)
            assert.strictEqual(isCorrect, answer.isCorrect)
        })
    })
  
})

//return an answer for a given answerId
async function getAnswer(_answerId) 
{
    let _answer;

    await AnswerMock.findOne({
        where: {
            answerId: _answerId
        }
    }).then( answer => {
        _answer = answer;
    });

    return _answer;
}

//return the correct answer for a given question
async function getCorrectAnswer(_questionId) 
{
    let _answer;

    await AnswerMock.findAll({
      where: {
        questionId: _questionId,
        isCorrect: true
      }
    }).then( answer => {
      _answer = answer;
    });

    return _answer;
}

//add an answer to a given question
async function addAnswerToQuestion(_questionId, _content, _isCorrect)
{
    let instance
    await AnswerMock.create({ 
        questionId: _questionId, 
        content: _content,
        isCorrect: _isCorrect
    }).then( answer => {
        instance = answer
    });

    return instance
}
