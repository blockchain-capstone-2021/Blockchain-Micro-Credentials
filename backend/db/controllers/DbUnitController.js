const { models } = require('../models/index')

//return unit by unitId
async function getUnit(_unitId) 
{
  let _unit;

  await models.Unit.findByPk(_unitId).then( unit => {
    _unit = unit;
  });

  return _unit;
}

//return all unitar for a given staffId
async function getUnitByStaff(_staffId) 
{
  let _units;

  await models.Unit.findAll({
      where: {
        staffId: _staffId
      }
    }).then( units => {
      _units = units;
  });

  return _units;
}

module.exports = {
    getUnitByStaff,
    getUnit
}