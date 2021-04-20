const express = require('express')
const { getDegrees } = require('../db/controllers/DegreeController')
var router = express.Router()

router.get('/', getDegrees, async function (req, res, next) {
    if(res.locals.degrees) {
        return res.status(200).send({
            success: 'true',
            degrees: res.locals.degrees
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'No degrees found.'
    })
})


module.exports = router;