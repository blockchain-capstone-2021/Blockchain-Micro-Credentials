const express = require('express')
const { getUnitsByStaff } = require('../controllers/Unit_Controller')
const { getEnrolmentsByUnit } = require('../controllers/Enrolment_Controller')
const { getModules } = require('../controllers/Module_Controller')
var router = express.Router()

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

router.get('/:unitId/enrolled', getEnrolmentsByUnit, async function (req, res, next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: 'true',
            students: {available: res.locals.availableStudents, unavailable: res.locals.unavailableStudents},
            scores: res.locals.studentScoreMap 
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'No students enrolled.'
    })
})

router.get('/:unitId/:studentId', getModules, async function (req, res, next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: 'true',
            modules: res.locals.modules,
            highestScore: res.locals.highestResultMap,
            numAttempts: res.locals.noOfAttemptsMap
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'No modules found.'
    })
})

module.exports = router;