const express = require('express')
const { submitManualEntry } = require('../controllers/Manual_Entry_Controller')
var router = express.Router()


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


// router.post('/create', createQuestion ,async function (req, res, next) {
//     if(res.locals.response.success) {
//         return res.status(201).send({
//             success: res.locals.response.success,
//             message: res.locals.response.message,
//             question: res.locals.response.question,
//         })
//     }
//     return res.status(400).send({
//         success: 'false',
//         message: 'ModuleId or data for question is missing.'
//     })
// })

module.exports = router;