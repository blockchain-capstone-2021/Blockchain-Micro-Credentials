const { models } = require('../models/index')

const getUnits = async (req, res, next) => {
    await models.Unit.findAll().then(units => {
        res.locals.units = units
    });
    next();
}

const getUnit = async (req, res, next) => {
    await models.Unit.findAll({where: {unitId:req.params.id}}).then(unit => {
        res.locals.unit = unit
    });
    next();
}

const getModules = async (req, res, next) => {
    await models.Module.findAll({where: {unitId: req.params.id}}).then(modules => {
        res.locals.modules = modules
    });
    next();
}


module.exports = {
    getUnits,
    getUnit,
    getModules
}
