const express = require('express')
const { getModule, getModulesForStaff, submitModule, publishModule, unpublishModule, updateModuleNoOfQuestions, getBestAttempt, getAttempt } = require('../controllers/Module_Controller')
const { getRandomizedQuestions } = require('../controllers/Question_Controller')
var router = express.Router()

// Get method which returns questions for modules taught by staff
router.get('/:unitId', getModulesForStaff, async function (req,res,next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success,
            modules: res.locals.modules,
            availableQuestions: Object.fromEntries(res.locals.availableQuestions)
        })
    }
    return res.status(400).send({
        message: "That did not work. Try again."
    })
})

// Get method which returns questions for a module in random order
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

// Post method to publish a module 
router.post('/:moduleId/publish', publishModule, async function (req,res,next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success
        })
    } else if (res.locals.customError){
        return res.status(200).send({
            success: 'false',
            message: res.locals.errorMessage
        })
    }
    return res.status(400).send({
        message: "Sorry something went wrong. Try again later."
    }) 
})

// Post method to unpublish a module 
router.post('/:moduleId/unpublish', unpublishModule, async function (req,res,next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success
        })
    } else if (res.locals.customError){
        return res.status(200).send({
            success: 'false',
            message: res.locals.errorMessage
        })
    }
    return res.status(400).send({
        message: "Sorry something went wrong. Try again later."
    }) 
})

// Post method to submit a module 
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

// Get method which returns information on a module
router.get('/:moduleId/info/', getModule, async function (req,res,next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success,
            module: res.locals.module
        })
    }
    return res.status(400).send({
        message: "That did not work. Try again."
    })
})

// Get method which returns information on a module
router.post('/:moduleId/edit/:noOfQuestions', updateModuleNoOfQuestions, async function (req,res,next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success
        })
    }
    return res.status(400).send({
        message: "That did not work. Try again."
    })
})

router.get('/attempt/:studentId/:unitId/:moduleId/:attemptNo', getAttempt, async function (req, res, next){
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success,
            questions: res.locals.questions,
            answersMap: res.locals.answersMap,
            providedAnswerMap: res.locals.providedAnswerMap,
            score: res.locals.score
        })
    }
    return res.status(400).send({
        message: "That did not work. Try again."
    })
})

router.get('/attempt/:studentId/:unitId/:moduleId', getBestAttempt, async function (req, res, next){
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success,
            questions: res.locals.questions,
            answersMap: res.locals.answersMap,
            providedAnswerMap: res.locals.providedAnswerMap,
            score: res.locals.score
        })
    }
    return res.status(400).send({
        message: "That did not work. Try again."
    })
})

module.exports = router;