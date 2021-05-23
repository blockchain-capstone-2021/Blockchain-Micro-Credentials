const { models } = require('../models/index');

//return all enrolments for a given studentId and semester of enrolment
async function getEnrolmentsByStudent(studentId, semOfEnrol) {
    let _enrolments;

    await models.Enrolment.findAll({
        where: {
            studentId: studentId,
            semOfEnrolment: semOfEnrol
        }
    }).then(enrolments => {
        _enrolments = enrolments;
    });

    return _enrolments;
}

//return all enrolments for a given studentId
async function getAllEnrolments(studentId) {
    let _enrolments;

    await models.Enrolment.findAll({
        where: {
            studentId: studentId,
        }
    }).then(enrolments => {
        _enrolments = enrolments;
    });

    return _enrolments;
}

//return all enrollments for a given unitId and semester of enrolment
async function getEnrolmentsByUnit(unitId, semOfEnrol) {
    let _enrolments;

    await models.Enrolment.findAll({
        where: {
            unitId: unitId,
            semOfEnrolment: semOfEnrol
        }
    }).then(enrolments => {
        _enrolments = enrolments;
    });

    return _enrolments;
}

module.exports = {
    getEnrolmentsByStudent,
    getEnrolmentsByUnit,
    getAllEnrolments
};