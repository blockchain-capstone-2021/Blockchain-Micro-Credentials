const express = require('express')
const { getUnitModules } = require('../controllers/Module_Controller')
var router = express.Router()


router.get('/:unitId', getUnitModules, async function (req,res,next) {
    if(res.locals.success) {
        return res.status(200).send({
            success: res.locals.success,
            modules: res.locals.modules
        })
    }
    return res.status(400).send({
        message: "That did not work. Try again."
    })
})
module.exports = router;