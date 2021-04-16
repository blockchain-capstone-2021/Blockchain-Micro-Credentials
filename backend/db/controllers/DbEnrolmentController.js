const { models } = require('../models/index')

//return all enrolments for a given studentId
async function getEnrolmentsByStudent(_studentId) 
{
    let _enrolments;

    await models.Enrolment.findAll({
        where: {
          studentId: _studentId
        }
      }).then( enrolments => {
        _enrolments = enrolments;
    });

    return _enrolments;
}

//return all enrollments for a given unitId
async function getEnrolmentsByUnit(_unitId) 
{
  let _enrolments;

  await models.Enrolment.findAll({
      where: {
        unitId: _unitId
      }
    }).then( enrolments => {
      _enrolments = enrolments;
  });

  return _enrolments;
}

module.exports = {
    getEnrolmentsByStudent,
    getEnrolmentsByUnit
}