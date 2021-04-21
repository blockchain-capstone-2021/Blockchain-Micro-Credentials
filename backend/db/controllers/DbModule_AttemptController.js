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
    let attempts = await getNoOfAttempts(_studentId, _moduleId)
    if(attempts > 0){
        let incrementedAttempts = attempts + 1
        await models.Module_Attempt.update({ attemptNo: incrementedAttempts}, {
            where: {
                studentId: _studentId, 
                moduleId: _moduleId
            }
        });
    }else{
        await models.Module_Attempt.create({ 
            studentId: _studentId, 
            moduleId: _moduleId, 
            attemptNo: 1
        });
    }   
}

module.exports = {
    getNoOfAttempts,
    incrementAttempts
}