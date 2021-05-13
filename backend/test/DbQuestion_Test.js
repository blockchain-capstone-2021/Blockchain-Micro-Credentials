const assert = require('assert');
const dbQuestionController = require('../db/controllers/DbQuestionController')

describe('Db Question Controller', () => {
    describe('getRandomizedQuestions()', () => {
        it('should return the correct number of questions', async () => {
            let moduleId = 2
            let numberOfQuestions = 10 
            let randomizedQuestions = await dbQuestionController.getRandomizedQuestions(moduleId, numberOfQuestions)
            assert.strictEqual(randomizedQuestions.length, numberOfQuestions);
            for(const question of randomizedQuestions){
                assert.strictEqual(question.moduleId, moduleId);
            }
        }).timeout(10000);
    })
    describe('getQuestions()', () => {
        it('should return all the questions for a module', async () => {
            let moduleId = 1
            let questionBank =  await dbQuestionController.getQuestions(moduleId)
            let questionBankSize = await dbQuestionController.getQuestionsCount(moduleId)
            assert.strictEqual(questionBank.length, questionBankSize);
            for(const question of questionBank){
                assert.strictEqual(question.moduleId, moduleId);
            }
        }).timeout(10000);
    })
    describe('getQuestion()', () => {
        it('should return the correct question Id', async () => {
            let questionId = 31
            let question = await dbQuestionController.getQuestion(questionId)
            assert.strictEqual(question.questionId, questionId);
        }).timeout(10000);
        it('should return the incorrect question Id', async () => {
            let questionId = 31
            let expectedQuestionId = 32
            let question = await dbQuestionController.getQuestion(questionId)
            assert.notStrictEqual(question.questionId, expectedQuestionId);
        }).timeout(10000);
    })
});