const { models } = require('../models/index')

//return all answers for a given question
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

//return an answer for a given answerId
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