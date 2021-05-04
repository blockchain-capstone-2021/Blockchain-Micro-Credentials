const express = require('express')
const { getUnitModules, submitModule, publishModule, unpublishModule } = require('../controllers/Module_Controller')
const { getRandomizedQuestions } = require('../controllers/Question_Controller')
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

router.get('/:moduleId/questions', getRandomizedQuestions, async function (req,res,next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success,
            questions: res.locals.questions,
            answersMap: Object.fromEntries(res.locals.answersMap)
        })
    }
    return res.status(400).send({
        message: "There are no questions in the module."
    }) 
})

router.get('/:moduleId/publish', publishModule, async function (req,res,next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success
        })
    } else if (res.locals.customError){
        return res.status(400).send({
            success: 'false',
            message: res.locals.errorMessage
        })
    }
    return res.status(400).send({
        message: "Sorry something went wrong. Try again later."
    }) 
})

router.get('/:moduleId/unpublish', unpublishModule, async function (req,res,next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success
        })
    } else if (res.locals.customError){
        return res.status(400).send({
            success: 'false',
            message: res.locals.errorMessage
        })
    }
    return res.status(400).send({
        message: "Sorry something went wrong. Try again later."
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