const { models } = require('../models/index')

const createQuestion = async (req, res, next) => {
    if (!req.body.moduleId || !req.body.data) {
        res.locals['response'] = {
            success: 'false',
            message:'module id or question data is missing',
        }
    }

    const question = {
        moduleId: req.body.moduleId,
        data: req.body.data
    }

    await models.Question.create(question).then(question => {
        res.locals['response'] = {
            success: 'true',
            message: 'Question added successfully',
            question,
        }
    }).catch(err => {
        res.locals['response'] = {
            success: 'false',
            message:err,
        }
    })
    next()
};

const getQuestions = async (req, res, next) => {
    await models.Question.findAll({where: {moduleId :parseInt(req.params.moduleId)},limit: parseInt(req.params.total)}).then(questions => {
        res.locals.questions = questions
    });
    console.log(res.locals.questions);
    next();
}

module.exports = {
    createQuestion,
    getQuestions
}