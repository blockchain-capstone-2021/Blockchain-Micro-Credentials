const dbQuestionController = require('../db/controllers/DbQuestionController')
const dbModuleController = require('../db/controllers/DbModuleController')
const dbAnswerController = require('../db/controllers/DbAnswerController')

const getQuestions = async (req, res, next)=>{
    try{
        let module = await dbModuleController.getModule(parseInt(req.params.moduleId))
        res.locals.questions =  await dbQuestionController.getQuestions(parseInt(req.params.moduleId), module.noOfQuestions)
        res.locals.answersMap = await getAnswers(res.locals.questions)
        res.locals.success = true
    }
    catch(err){
        console.log(err);
        res.locals.success = false
    }
    finally{
        next();
    }
}

const addQuestionToModule = async (req, res, next)=>{
    try{
        let answersList = req.body.answers      
        let questionId = await dbQuestionController.addQuestionToModule(req.body.moduleId, req.body.questionContent)
        for (const answer of answersList){
            await dbAnswerController.addAnswerToQuestion(questionId, answer.content, answer.isCorrect)
        }

        res.locals.success = true
    }
    catch(err){
        console.log(err);
        res.locals.success = false
    }
    finally{
        next();
    }
}

const deleteQuestion = async (req, res, next)=>{
    try{
        await dbAnswerController.deleteAnswersOfQuestion(req.params.questionId)
        await dbQuestionController.deleteQuestion(req.params.questionId)

        res.locals.success = true
    }
    catch(err){
        console.log(err);
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
    getQuestions,
    addQuestionToModule,
    deleteQuestion
}