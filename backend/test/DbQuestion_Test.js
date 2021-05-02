const assert = require('assert');
const SequelizeMock = require('sequelize-mock');
var DBConnectionMock = new SequelizeMock();

const dbQuestionController = require('../db/controllers/DbQuestionController')

var QuestionMock = DBConnectionMock.define('questions', {
    'moduleId': 1,
    'content': 'This is example question 1 for module 1'
});

describe('Db Questions Controller', () => {
    describe('addQuestionToModule()', () => {
        it('should return the correct question Id', async () => {
            let moduleId = 1
            let content = 'sample question'
            let expectedQuestionId = 2
            let questionId = await addQuestionToModule(moduleId, content)
            assert.strictEqual(questionId, expectedQuestionId);
        }).timeout(10000);
    })
})

//add a new question to a given module
async function addQuestionToModule(_moduleId, _content)
{
    let _questionId
    await QuestionMock.create({ 
        moduleId: _moduleId, 
        content: _content
    }).then(function (question) {
        console.log(question)
        _questionId = question.get('id')
    });

    return _questionId
}

//delete question by question id
async function deleteQuestion(_questionId)
{
    await QuestionMock.destroy({
        where: {
            questionId: _questionId
        }
    })
}
async function deleteAllQuestions(_moduleId){
    await QuestionMock.destroy({
        where: {
            moduleId: _moduleId
        }
      })
}