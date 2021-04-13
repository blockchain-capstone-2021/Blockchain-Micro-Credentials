const express = require('express')
const { getUnit, getUnits } = require('../db/controllers/UnitController')
var router = express.Router()

router.get('/', getUnits, async function (req, res, next) {
    if(res.locals.units) {
        return res.status(200).send({
            success: 'true',
            units: res.locals.units
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'No units found.'
    })
})

router.get('/:id', getUnit, async function (req, res, next) {
    if(res.locals.unit) {
        return res.status(200).send({
            success: 'true',
            unit: res.locals.unit
        })
    }
    return res.status(400).send({
        success: 'false',
        message: 'Unit does not exist.'
    })
})

module.exports = router;