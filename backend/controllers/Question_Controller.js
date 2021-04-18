const dbQuestionController = require('../db/controllers/DbQuestionController')
const dbModuleController = require('../db/controllers/DbModuleController')
const dbAnswerController = require('../db/controllers/DbAnswerController')

const getQuestions = async (req, res, next)=>{
    await dbModuleController.getModule(req.params.moduleId).then(async (module) => {

        await dbQuestionController.getQuestions(req.params.moduleId, module.noOfQuestions).then(async (questions) => {
            res.locals.questions = questions

            await getAnswers(questions).then(map =>{
                res.locals.answersMap = map
            });
        });

    });
}

async function getAnswers(questions)
{
    let answersMap = new Map()

    for (const question of questions){
        await dbAnswerController.getAnswers(question.questionId).then(answers=>{
            answersMap[question.questionId] = answers 
        });
    } 

    return answersMap;
}

module.exports = {
    getQuestions
}