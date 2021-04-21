const express = require('express')
const { getEnrolmentsByUnit, getUnitsByStaff } = require('../controllers/Enrolment_Controller')
var router = express.Router()

router.get('/courses/:unitId/enrolled', getUnitsByStaff, async function (req, res, next) {
    if(res.locals.units) {
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