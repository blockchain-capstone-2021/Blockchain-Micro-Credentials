const { models } = require('../models/index')

//return number of attempts for a given studentId and moduleId
async function getNoOfAttempts(_studentId, _moduleId) 
{
    let attempts = 0;

    let module_attempt = await models.Module_Attempt.findOne({
        where: {
            studentId: _studentId,
            moduleId: _moduleId
        }
    })

    if(module_attempt){
        attempts = module_attempt.attemptNo
    }

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