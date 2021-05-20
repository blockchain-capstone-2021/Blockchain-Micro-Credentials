const express = require('express')
const { getUnitsByStaff } = require('../controllers/Unit_Controller')
const { getEnrolmentsByUnit } = require('../controllers/Enrolment_Controller')
const { getModulesForStudent } = require('../controllers/Module_Controller')
const { submitMicroCred } = require('../controllers/Microcredential_Controller')
var router = express.Router()

// Get method which returns units taught by a staff
router.get('/:staffId', getUnitsByStaff, async function (req, res, next) {
    if(res.locals.units) {
        return res.status(200).send({
            success: 'true',
            units: res.locals.units
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'No units found.'
    })
})

// Get method which returns students enrolled in a unit
router.get('/:unitId/enrolled', getEnrolmentsByUnit, async function (req, res, next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: 'true',
            students: {available: res.locals.availableStudents, unavailable: res.locals.unavailableStudents},
            scores: Object.fromEntries(res.locals.studentScoreMap)
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'No students enrolled.'
    })
})

// Get method which returns modules taken by a student
router.get('/:unitId/:studentId', getModulesForStudent, async function (req, res, next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: 'true',
            modules: res.locals.modules,
            highestScore: Object.fromEntries(res.locals.highestScoreMap),
            numAttempts: Object.fromEntries(res.locals.attemptsMap),
            cumulativeScore: res.locals.cumulativeScore,
            finalGrade: res.locals.finalGrade,
            submittable: res.locals.submittable
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'No modules found.'
    })
})

// Post method to submit a microcredential
router.post('/submit/:studentId/:unitId/:enrolmentPeriod', submitMicroCred, async function (req, res, next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success
        })
    }
    else if (res.locals.customError){
        return res.status(200).send({
            success: 'false',
            message: res.locals.errorMessage
        })
    }
    return res.status(400).send({
        success: res.locals.success,
        message: 'Could not submit micro-credential. Try again.'
    })
})

module.exports = router;