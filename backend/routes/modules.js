const express = require('express')
const { getUnitModules, submitModule } = require('../controllers/Module_Controller')
const { getQuestions } = require('../controllers/Question_Controller')
var router = express.Router()


router.get('/:unitId', getUnitModules, async function (req,res,next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success,
            modules: res.locals.modules
        })
    }
    return res.status(400).send({
        message: "That did not work. Try again."
    })
})

router.get('/:moduleId/questions', getQuestions, async function (req,res,next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success,
            questions: res.locals.questions,
            answersMap: res.locals.answersMap
        })
    }
    return res.status(400).send({
        message: "There are no questions in the module."
    }) 
})

router.post('/submit', submitModule ,async function (req,res,next) {
    if (res.locals.success) {
        return res.status(200).send({
            success: true
        })
    }
    return res.status(400).send({
        message: "There was an issue. Please try again."
    }) 
})

module.exports = router;