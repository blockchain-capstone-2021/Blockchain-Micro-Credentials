const { models } = require('../models/index')

//return all enrolments for a given studentId
async function getEnrolmentsByStudent(_studentId, _semOfEnrol) 
{
    let _enrolments;

    await models.Enrolment.findAll({
        where: {
          studentId: _studentId,
          semOfEnrolment: _semOfEnrol
        }
      }).then( enrolments => {
        _enrolments = enrolments;
    });

    return _enrolments;
}

//return all enrollments for a given unitId
async function getEnrolmentsByUnit(_unitId, _semOfEnrol) 
{
  let _enrolments;

  await models.Enrolment.findAll({
      where: {
        unitId: _unitId,
        semOfEnrolment: _semOfEnrol
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