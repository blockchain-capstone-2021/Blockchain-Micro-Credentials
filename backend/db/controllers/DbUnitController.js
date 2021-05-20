const { models } = require('../models/index');

//return unit by unitId
async function getUnit(unitId) {
    let _unit;

    await models.Unit.findByPk(unitId).then(unit => {
        _unit = unit;
    });

    return _unit;
}

//return all units for a given staffId
async function getUnitByStaff(staffId) {
    let _units;

    await models.Unit.findAll({
        where: {
            staffId: staffId
        }
    }).then(units => {
        _units = units;
    });

    return _units;
}

module.exports = {
    getUnitByStaff,
    getUnit
};