const express = require('express')
const { createStudent, getStudents, getStudent, updateStudent, getStudentEnrolments } = require('../db/controllers/StudentController')
var router = express.Router()

router.get('/', getStudents, async function (req, res, next) {
    if(res.locals.students) {
        return res.status(200).send({
            success: 'true',
            students: res.locals.students
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'No students found.'
    })
})

router.get('/:id', getStudent, async function (req, res, next) {
    if(res.locals.student) {
        return res.status(200).send({
            success: 'true',
            student: res.locals.student
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'Student does not exist.'
    })
})

router.get('/:id/enrolments', getStudentEnrolments, async function (req, res, next) {
    if(res.locals.enrolments) {
        return res.status(200).send({
            success: 'true',
            enrolments: res.locals.enrolments
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'Enrolments for the student does not exist.'
    })
})

router.post('/create', createStudent ,async function (req, res, next) {
    if(res.locals.response.success) {
        return res.status(201).send({
            success: res.locals.response.success,
            message: res.locals.response.message,
            student: res.locals.response.student,
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'Student data is missing.'
    })
});

router.post('/:id/edit', updateStudent, async function (req, res, next) {
    if(res.locals.response.success) {
        return res.status(201).send({
            success: res.locals.response.success,
            message: res.locals.response.message,
            student: res.locals.response.student,
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'Student data is missing.'
    })
})

// router.put('/:id/updateCreditPoints', updateCreditPoints, async function(req, res, next) {
//     if(res.locals.response.success) {
//         return res.status(200).send({
//             success: 'true',
//             student: res.locals.student
//         })
//     }
//     return res.status(400).send({
//         success: 'false',
//         message: 'id or credit points is missing.'
//     })
// })

module.exports = router;