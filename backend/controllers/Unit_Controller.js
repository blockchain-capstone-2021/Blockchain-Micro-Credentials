const dbUnitController = require('../db/controllers/DbUnitController')

const getUnitsByStaff = async (req, res, next) => {
    await dbUnitController.getUnitByStaff(req.params.staffId).then(units => {
        res.locals.units = units
    });
    next();
}

module.exports = {
    getUnitsByStaff
}