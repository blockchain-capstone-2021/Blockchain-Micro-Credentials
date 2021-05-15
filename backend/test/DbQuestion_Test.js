const assert = require('assert');

const sequelizeMock = require('sequelize-mock')
var DBConnectionMock = new sequelizeMock

var QuestionMock = DBConnectionMock.define('questions', {
    moduleId: 1,
    content: "Test"
});

describe('Db Question Controller', () => {
    describe('getRandomizedQuestions()', () => {
        it('should return the correct number of questions', async () => {
            let moduleId = 1
            let numberOfQuestions = 1
            let randomizedQuestions = await getRandomizedQuestions(moduleId, numberOfQuestions)
            assert.strictEqual(randomizedQuestions.length, numberOfQuestions);
            for(const question of randomizedQuestions){
                assert.strictEqual(question.moduleId, moduleId);
            }
        }).timeout(10000);
    })
    describe('getQuestions()', () => {
        it('should return all the questions for a module', async () => {
            let moduleId = 1
            let questionBank =  await getQuestions(moduleId)
            let questionBankSize = await getQuestionsCount(moduleId)
            let questionBankCount = questionBankSize.count
            assert.strictEqual(questionBank.length, questionBankCount);
            for(const question of questionBank){
                assert.strictEqual(question.moduleId, moduleId);
            }
        }).timeout(10000);
    })
    describe('getQuestion()', () => {
        it('should return the correct question Id', async () => {
            let questionId = 1
            let question = await getQuestion(questionId)
            assert.strictEqual(question.id, questionId);
        }).timeout(10000);
        it('should return the incorrect question Id', async () => {
            let questionId = 1
            let expectedQuestionId = 2
            let question = await getQuestion(questionId)
            assert.notStrictEqual(question.id, expectedQuestionId);
        }).timeout(10000);
    })
});


//return a given number of randomised questions for a given module
async function getRandomizedQuestions (_moduleId, noOfQuestions) 
{
    let _questions = await getQuestions(_moduleId);
    let _returnQuestions = [];
  
    for(var i=1; i<=noOfQuestions; i++)
    {
        var index = Math.floor(Math.random()*(_questions.length-1)+0);
        let question = _questions[index]
        _questions.splice(index, 1);
        _returnQuestions.push(question)
    }
    return _returnQuestions;
}

async function getQuestions (_moduleId) 
{
    let _questions;

    await QuestionMock.findAll({
        where: {
          moduleId: _moduleId
        }
      }).then( questions => {
        _questions = questions;
    });

    return _questions
}

//return a question for a given questionId
async function getQuestion(_questionId) 
{
    let _question;

    await QuestionMock.findById(_questionId).then( question => {
        _question = question;
    });

    return _question;
}

async function getQuestionsCount(_moduleId){

    const count = await QuestionMock.findAndCount({
        where: {
            moduleId: _moduleId
        }
      });

    return count
}