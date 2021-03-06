const express = require('express')
const { getAnswers } = require('../controllers/Answer_Controller')
const { addQuestionToModule, getQuestion, getQuestionsForStaff, deleteQuestion, deleteAllQuestions } = require('../controllers/Question_Controller')
var router = express.Router()

// Get method which returns answers for a question
router.get('/:questionId/answers', getAnswers, async function (req, res, next) {
    if(res.locals.answers) {
        return res.status(200).send({
            success: 'true',
            answers: res.locals.answers
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'No answers found.'
    })
})

// Get method which returns questions for a module
router.get('/:moduleId/:total', getQuestionsForStaff, async function (req, res, next) {
    if(res.locals.questions) {
        return res.status(200).send({
            success: 'true',
            questions: res.locals.questions
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'No questions found.'
    })
})

// Get method which returns questions based on ID
router.get('/:questionId', getQuestion, async function (req, res, next) {
    if(res.locals.question) {
        return res.status(200).send({
            success: 'true',
            question: res.locals.question
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'No questions found.'
    })
})

// Post method which deletes a question
router.post('/:questionId/delete', deleteQuestion, async function (req, res, next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: 'true'
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'No question found.'
    })
})


// Post method which creates a question for a module
router.post('/create', addQuestionToModule, async function (req, res, next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: 'true'
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'No question found.'
    })
})

// Post method which deletes all questions in a module
router.post('/:moduleId/deleteAll', deleteAllQuestions, async function (req, res, next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: 'true'
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'No question found.'
    })
})

module.exports = router;