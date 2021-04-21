const dbQuestionController = require('../db/controllers/DbQuestionController')
const dbModuleController = require('../db/controllers/DbModuleController')
const dbAnswerController = require('../db/controllers/DbAnswerController')

const getQuestions = async (req, res, next)=>{
    try{
        let module = await dbModuleController.getModule(parseInt(req.params.moduleId))
        res.locals.questions =  await dbQuestionController.getQuestions(parseInt(req.params.moduleId), module.noOfQuestions)
        res.locals.answersMap = await getAnswers(questions)

        res.locals.success = true
    }
    catch(err){
        res.locals.success = false
    }
    finally{
        next();
    }
}

async function getAnswers(questions)
{
    let answersMap = new Map()

    for (const question of questions){
        answersMap[question.questionId] = await dbAnswerController.getAnswers(question.questionId)
    } 

    return answersMap;
}

module.exports = {
    getQuestions
}