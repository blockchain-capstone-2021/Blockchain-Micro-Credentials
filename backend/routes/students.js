const express = require('express')
const { getEnrolmentsByStudent } = require('../controllers/Enrolment_Controller')
const { getStudent } = require('../controllers/Student_Controller')

var router = express.Router()

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

    router.get('/:studentId/enrolled', getEnrolmentsByStudent, async function (req, res, next) {
        if(res.locals) {
            return res.status(200).send({
                success: 'true',
                enrolments: {available: res.locals.availableEnrolments, unavailable: res.locals.unavailableEnrolments},
                unitMap: res.locals.unitMap 
            })
        }
        return res.status(400).send({
            success: 'false',
            message: 'No students enrolled.'
        })
    })

module.exports = router;
