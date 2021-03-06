const express = require('express')
const { getEnrolmentsByStudent } = require('../controllers/Enrolment_Controller')
const { getStudent } = require('../controllers/Student_Controller')

var router = express.Router()

// Get method which returns student details
router.get('/:studentId', getStudent, async function (req, res, next) {
        if(res.locals.success) {
            return res.status(200).send({
                success: 'true',
                student: res.locals.student,
                degreeName: res.locals.degree
                })
            }
            
        return res.status(400).send({
            success: 'false',
            message: 'Student not found'
            })
    })

// Get method which returns all enrolments for a student
router.get('/:studentId/enrolled', getEnrolmentsByStudent, async function (req, res, next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: 'true',
            enrolments: {available: res.locals.availableEnrolments, unavailable: res.locals.unavailableEnrolments},
            unitMap: Object.fromEntries(res.locals.unitMap)
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'Sorry, something went wrong.'
    })
})

module.exports = router;
