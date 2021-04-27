const express = require('express')
const { submitStaffLogin } = require('../controllers/Staff_Controller')
const { submitStudentLogin } = require('../controllers/Student_Controller')
var router = express.Router()


router.post('/staff/:staffId/:password', submitStaffLogin, async function (req,res,next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success,
            exists: res.locals.exists,
            loggedIn: res.locals.loggedIn
        })
    }
    return res.status(400).send({
        message: "That did not work. Try again."
    })
})

router.post('/student/:studentId/:password', submitStudentLogin, async function (req,res,next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success,
            exists: res.locals.exists,
            loggedIn: res.locals.loggedIn
        })
    }
    return res.status(400).send({
        message: "That did not work. Try again."
    })
})

module.exports = router;