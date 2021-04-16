const { models } = require('../models/index')

//return number of attempts for a given studentId and moduleId
async function getNoOfAttempts(_studentId, _moduleId) 
{
    let attempts = 0;

    await models.Module_Attempt.findAll({
        where: {
            studentId = _studentId,
            moduleId: _moduleId
        }
      }).then( module_attempts => {
          if(module_attempts){
            attempts = module_attempts.length
          }
    });

    return attempts;
}

//increment number of attempts for a given studentId and moduleId
async function incrementAttempts(_studentId, _moduleId)
{
    let attempts = getNoOfAttempts(_studentId, _moduleId) + 1
    await models.Student.update({ noAttempts: attempts}, {
        where: {
            studentId: _studentId, 
            moduleId: _moduleId
        }
      });
}

module.exports = {
    getNoOfAttempts,
    incrementAttempts
}