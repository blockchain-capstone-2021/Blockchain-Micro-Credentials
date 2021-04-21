const dbUnitController = require('../db/controllers/DbUnitController')

const getUnitsByStaff = async (req, res, next) => {
    res.locals.units = await dbUnitController.getUnitByStaff(req.params.staffId)
    next();
}

module.exports = {
    getUnitsByStaff
}