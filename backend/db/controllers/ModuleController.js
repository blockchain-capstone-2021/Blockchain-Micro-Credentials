const { models } = require('../models/index')


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