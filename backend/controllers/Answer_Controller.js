const dbAnswerController = require('../db/controllers/DbAnswerController')

const getAnswers = async (req, res, next)=>{
    try{
        res.locals.answers = await dbAnswerController.getAnswers(req.params.questionId)
        res.locals.success = true
    }
    catch(err){
        res.locals.success = false
    }
    finally{
        next();
    }
}

module.exports = {
    getAnswers
}