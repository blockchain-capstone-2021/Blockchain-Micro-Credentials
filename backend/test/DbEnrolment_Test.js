const assert = require('assert');
var DbEnrolmentController = require('../db/controllers/DbEnrolmentController');


describe('Enrolment', () => {
    //Test to check whether returned enrolments are for a given student and given semester 
    describe('getEnrolmentsByStudent()', () => {
        it('should return the enrolment with the correct enrolmentId', async () => {
            let expectedEnrolmentId = 1;
            let studentId = "s3541003";
            let sem = "Y2021S1";
            let actualEnrolments = await DbEnrolmentController.getEnrolmentsByStudent(studentId, sem);
            let actualEnrolmentId = actualEnrolments[0].enrolmentId;
            assert.strictEqual(actualEnrolmentId, expectedEnrolmentId);
            for (const enrolment of actualEnrolments) {
                assert.strictEqual(enrolment.studentId, studentId);
                assert.strictEqual(enrolment.semOfEnrolment, sem);
            }
        }).timeout(10000);
    });
    //Test to check whether returned enrolments are for a given student
    describe('getAllEnrolments()', () => {
        it('should return all enrolments for the given student', async () => {
            let studentId = "s3541003";
            let actualEnrolments = await DbEnrolmentController.getAllEnrolments(studentId);
            for (const enrolment of actualEnrolments) {
                assert.strictEqual(enrolment.studentId, studentId);
            }
        }).timeout(10000);
    });
    //Test to check whether returned enrolments are for a given unit
    describe('getEnrolmentsByUnit()', () => {
        it('should return the enrolment with the correct enrolmentId', async () => {
            let expectedEnrolmentId = 1;
            let unitId = "COSC2536";
            let sem = "Y2021S1";
            let actualEnrolments = await DbEnrolmentController.getEnrolmentsByUnit(unitId, sem);
            let actualEnrolmentId = actualEnrolments[0].enrolmentId;
            assert.strictEqual(actualEnrolmentId, expectedEnrolmentId);
            for (const enrolment of actualEnrolments) {
                assert.strictEqual(enrolment.unitId, unitId);
                assert.strictEqual(enrolment.semOfEnrolment, sem);
            }
        }).timeout(10000);
    });

});