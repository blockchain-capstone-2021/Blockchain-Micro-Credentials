const { models } = require('../models/index')

//return a given number of randomised questions for a given module
async function getQuestions (_moduleId, noOfQuestions) 
{
    let _questions;
    let _returnQuestions = [];

    await models.Question.findAll({
        where: {
          moduleId: _moduleId
        }
      }).then( questions => {
        _questions = questions;
    });
  
    for(var i=1; i<=noOfQuestions; i++)
    {
        var index = Math.floor(Math.random()*(_questions.length-1)+0);
        let question = _questions[index]
        _questions.splice(index, 1);
        _returnQuestions.push(question)
    }
    return _returnQuestions;
}

//return a question for a given questionId
async function getQuestion(_questionId) 
{
    let _question;

    await models.Question.findByPk(_questionId).then( question => {
        _question = question;
    });

    return _question;
}

async function getQuestionsCount(_moduleId){

    const count = await models.Question.count({
        where: {
            moduleId: _moduleId
        }
      });

    return count
}

//add a new question to a given module
async function addQuestionToModule(_moduleId, _content)
{
    let _questionId
    await models.Question.create({ 
        moduleId: _moduleId, 
        content: _content
    }).then(question => {
        _questionId = question.questionId
    });

    return _questionId
}

//delete question by question id
async function deleteQuestion(_questionId)
{
    await models.Question.destroy({
        where: {
            questionId: _questionId
        }
    })
}

module.exports = {
    getQuestions,
    getQuestion,
    addQuestionToModule,
    getQuestionsCount,
    deleteQuestion
}