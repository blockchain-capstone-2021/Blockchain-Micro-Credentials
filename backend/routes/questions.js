const express = require('express')
const { createQuestion, getQuestions } = require('../controllers/Question_Controller')
var router = express.Router()


router.get('/',getQuestions, async function (req, res, next) {
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

// router.post('/create', createQuestion ,async function (req, res, next) {
//     if(res.locals.response.success) {
//         return res.status(201).send({
//             success: res.locals.response.success,
//             message: res.locals.response.message,
//             question: res.locals.response.question,
//         })
//     }
//     return res.status(400).send({
//         success: 'false',
//         message: 'ModuleId or data for question is missing.'
//     })
// })


module.exports = router;