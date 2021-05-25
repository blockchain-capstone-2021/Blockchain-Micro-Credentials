const express = require('express')
const { submitManualEntry } = require('../controllers/Manual_Entry_Controller')
var router = express.Router()

// Post method to submit final mark for student
router.post('/submitFinalMark/:studentId/:unitId/:finalResult', submitManualEntry, async function (req,res,next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success
        })
    }
    return res.status(400).send({
        message: "That did not work. Try again."
    })
})

module.exports = router;