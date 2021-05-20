const { models } = require('../models/index');

//return number of attempts for a given studentId, moduleId, and semester of enrolment
async function getNoOfAttempts(studentId, moduleId, semOfEnrolment) {
    let attempts = 0;

    let module_attempt = await models.Module_Attempt.findOne({
        where: {
            studentId: studentId,
            moduleId: moduleId,
            semOfEnrolment: semOfEnrolment
        }
    });

    if (module_attempt) {
        attempts = module_attempt.attemptNo;
    }

    return attempts;
}

//increment number of attempts for a given studentId, moduleId, and semester of enrolment
async function incrementAttempts(studentId, moduleId, semOfEnrolment) {
    let attempts = await getNoOfAttempts(studentId, moduleId, semOfEnrolment);

    if (attempts > 0) {
        let incrementedAttempts = attempts + 1;
        await models.Module_Attempt.update({ attemptNo: incrementedAttempts }, {
            where: {
                studentId: studentId,
                moduleId: moduleId,
                semOfEnrolment: semOfEnrolment
            }
        });
    } else {
        await models.Module_Attempt.create({
            studentId: studentId,
            moduleId: moduleId,
            semOfEnrolment: semOfEnrolment,
            attemptNo: 1
        });
    }
}

//return an attempt for a given moduleId and semester of enrolment
//simply to check whether a previous attempt exists
async function checkAttemptsExist(moduleId, semOfEnrolment) {
    let module_attempt = await models.Module_Attempt.findOne({
        where: {
            moduleId: moduleId,
            semOfEnrolment: semOfEnrolment
        }
    });
    return module_attempt;
}

module.exports = {
    getNoOfAttempts,
    incrementAttempts,
    checkAttemptsExist
};