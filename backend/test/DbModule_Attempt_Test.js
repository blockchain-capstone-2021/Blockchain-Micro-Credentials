const assert = require('assert');

const sequelizeMock = require('sequelize-mock');
var DBConnectionMock = new sequelizeMock;

var Module_AttemptMock = DBConnectionMock.define('module_attempts', {
    studentId: "s3541003",
    moduleId: 1,
    semOfEnrolment: "Y2021S1",
    attemptNo: 1
});

describe('Module_Attempt', () => {
    //test that the correct number of attempts is returned for a given student id, module id, and semester of enrolment
    describe('getNoOfAttempts()', () => {
        it('should return the correct number of attempts for the given parameters', async () => {
            let expectedAttemptNo = 1;
            let moduleId = 1;
            let studentId = "s3541003";
            let sem = "Y2021S1";
            let actualAttemptNo = await getNoOfAttempts(studentId, moduleId, sem);
            assert.strictEqual(actualAttemptNo, expectedAttemptNo);
        }).timeout(10000);
    });
    //test that the correct attempt is returned for a given student id, module id, and semester of enrolment
    describe('checkAttemptsExist()', () => {
        it('should return an attempt matching the expected student and module id and semester', async () => {
            let expectedStudentId = "s3541003";
            let moduleId = 1;
            let sem = "Y2021S1";
            let actualAttempt = await checkAttemptsExist(moduleId, sem);
            assert.strictEqual(actualAttempt.studentId, expectedStudentId);
            assert.strictEqual(actualAttempt.moduleId, moduleId);
            assert.strictEqual(actualAttempt.semOfEnrolment, sem);
        }).timeout(10000);
    });

});


//return number of attempts for a given studentId and moduleId
async function getNoOfAttempts(_studentId, _moduleId, _semOfEnrolment) {
    let attempts = 0;

    let module_attempt = await Module_AttemptMock.findOne({
        where: {
            studentId: _studentId,
            moduleId: _moduleId,
            semOfEnrolment: _semOfEnrolment
        }
    });

    if (module_attempt) {
        attempts = module_attempt.attemptNo;
    }

    return attempts;
}

async function checkAttemptsExist(_moduleId, _semOfEnrolment) {
    let module_attempt = await Module_AttemptMock.findOne({
        where: {
            moduleId: _moduleId,
            semOfEnrolment: _semOfEnrolment
        }
    });
    return module_attempt;
}