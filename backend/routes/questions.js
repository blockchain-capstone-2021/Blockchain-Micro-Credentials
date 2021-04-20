const express = require('express')
const { createQuestion, getQuestions, getAnswers } = require('../db/controllers/QuestionController')
var router = express.Router()


// router.get('/', getAllQuestions, async function (req, res, next) {
//     if(res.locals.questions) {
//         return res.status(200).send({
//             success: 'true',
//             questions: res.locals.questions
//         })
//     }
//     return res.status(400).send({
//         success: 'false',
//         message: 'No questions found.'
//     })
// })

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

router.get('/:moduleId/:total', getQuestions, async function (req, res, next) {
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


router.post('/create', createQuestion ,async function (req, res, next) {
    if(res.locals.response.success) {
        return res.status(201).send({
            success: res.locals.response.success,
            message: res.locals.response.message,
            question: res.locals.response.question,
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'ModuleId or data for question is missing.'
    })
})


module.exports = router;