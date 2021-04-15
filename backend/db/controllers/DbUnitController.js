const { models } = require('../models/index')

//return all answers for a given question
async function getUnit(_unitId) 
{
  let _unit;

  await models.Unit.findByPk(_unitId).then( unit => {
    _unit = unit;
  });

  return _unit;
}

//return an answer for a given answerId
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