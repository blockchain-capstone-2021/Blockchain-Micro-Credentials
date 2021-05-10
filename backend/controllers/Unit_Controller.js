const dbUnitController = require('../db/controllers/DbUnitController')

const getUnitsByStaff = async (req, res, next) => {
    try{
        res.locals.units = await dbUnitController.getUnitByStaff(req.params.staffId)
        res.locals.success = true
    }
    catch(err){
        res.locals.success = false
    }
    finally{
        next();
    }
}

module.exports = {
    getUnitsByStaff
}