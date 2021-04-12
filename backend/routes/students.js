const express = require('express')
const { createStudent, getStudents } = require('../db/controllers/StudentController')
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

router.post('/create', createStudent ,async function (req, res, next) {
    if(res.locals.response.success) {
        return res.status(201).send({
            success: res.locals.response.success,
            message: res.locals.response.message,
            student: res.locals.response.question,
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'Student data is missing.'
    })
});

module.exports = router;