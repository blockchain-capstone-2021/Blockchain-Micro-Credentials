const express = require('express')
const { getStudent } = require('../db/controllers/DbStudentController')
var router = express.Router()

router.get('/:studentId', async function (req, res, next) {
        await getStudent(req.params.studentId).then(student => {
        if(student) {
            return res.status(200).send({
                success: 'true',
                student
                })
            }
            
        return res.status(400).send({
            success: 'false',
            message: 'Student not found'
            })
        })
    })

        module.exports = router;
