const { models } = require('../models/index')

//return all answers for a given question
async function getAnswers(_questionId) 
{
    let _answers;

    await models.Answer.findAll({
        where: {
          questionId: _questionId
        }
      }).then( answers => {
        _answers = answers;
    });

    return _answers;
}

//return an answer for a given answerId
async function getAnswer(_answerId) 
{
    let _answer;

    await models.Answer.findByPk(_answerId).then( answer => {
        _answer = answer;
    });

    return _answer;
}

//return the correct answer for a given question
async function getCorrectAnswer(_questionId) 
{
    let _answer;

    await models.Answer.findAll({
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
    await models.Question.create({ 
        questionId: _moduleId, 
        content: _content,
        isCorrect: _isCorrect
    });
}

module.exports = {
    getAnswers,
    getAnswer,
    getCorrectAnswer,
    addAnswerToQuestion
}