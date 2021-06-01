const dbQuestionController = require('../db/controllers/DbQuestionController');
const dbModuleController = require('../db/controllers/DbModuleController');
const dbAnswerController = require('../db/controllers/DbAnswerController');

//returns questions for a given module
const getQuestionsForStaff = async (req, res, next) => {
    try {
        res.locals.questions = await dbQuestionController.getQuestions(req.params.moduleId);
        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
    }
    finally {
        next();
    }
};

//returns a question for a given question id
const getQuestion = async (req, res, next) => {
    try {
        res.locals.question = await dbQuestionController.getQuestion(req.params.questionId);
        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
    }
    finally {
        next();
    }
};

//returns a random list of questions (a subset of the question bank) and their answers for a given module
//random list will be equal in length to the required number of displayable questions for the module
const getRandomizedQuestions = async (req, res, next) => {
    try {
        let module = await dbModuleController.getModule(parseInt(req.params.moduleId));
        res.locals.questions = await dbQuestionController.getRandomizedQuestions(parseInt(req.params.moduleId), module.noOfQuestions);
        res.locals.answersMap = await getAnswers(res.locals.questions);
        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
    }
    finally {
        next();
    }
};

//create new question and answers from given content and module id
const addQuestionToModule = async (req, res, next) => {
    try {
        let answersList = req.body.answers;
        let questionId = await dbQuestionController.addQuestionToModule(req.body.moduleId, req.body.questionContent);
        for (const answer of answersList) {
            await dbAnswerController.addAnswerToQuestion(questionId, answer.content, answer.isCorrect);
        }

        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
    }
    finally {
        next();
    }
};

//delete question by a given question id
const deleteQuestion = async (req, res, next) => {
    try {
        await dbAnswerController.deleteAnswersOfQuestion(req.params.questionId);
        await dbQuestionController.deleteQuestion(req.params.questionId);

        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
    }
    finally {
        next();
    }
};

//delete all questions for a given module
const deleteAllQuestions = async (req, res, next) => {
    try {
        let questionIndicies = [];
        let questions = await dbQuestionController.getQuestions(req.params.moduleId);

        for (const question of questions) {
            questionIndicies.push(question.questionId);
        }

        await dbAnswerController.deleteAnswersOfQuestion(questionIndicies);
        await dbQuestionController.deleteAllQuestions(req.params.moduleId);

        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
    }
    finally {
        next();
    }
};

//get all answers for a given list of questions
async function getAnswers(questions) {
    let answersMap = new Map();

    for (const question of questions) {
        let answers = await dbAnswerController.getAnswers(question.questionId);
        answersMap.set(question.questionId, answers);
    }

    return answersMap;
}

module.exports = {
    getQuestion,
    getQuestionsForStaff,
    getRandomizedQuestions,
    addQuestionToModule,
    deleteQuestion,
    deleteAllQuestions,
    getAnswers
};