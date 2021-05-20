const assert = require('assert');

const dbStudentController = require('../db/controllers/DbStudentController');

describe('Db Student Controller', () => {
    describe('getStudent()', () => {
        //Test whether a given student is being returned. 
        it('should return the correct student Id', async () => {
            let studentId = 's3710669';
            let student = await dbStudentController.getStudent(studentId);
            assert.strictEqual(student.studentId, studentId);
        }).timeout(10000);
        //Test whether an incorrect student is not being returned.
        it('should return the incorrect student Id', async () => {
            let studentId = 's3710669';
            let expectedStudentId = "s3541003";
            let student = await dbStudentController.getStudent(studentId);
            assert.notStrictEqual(student.studentId, expectedStudentId);
        }).timeout(10000);
    });
    describe('checkStudentExists()', () => {
        //Test whether a student exists given a studentId.
        it('should return the student exists', async () => {
            let studentId = 's3710669';
            let expectedExists = true;
            let exists = await dbStudentController.checkStudentExists(studentId);
            assert.strictEqual(exists, expectedExists);
        }).timeout(10000);
        //Test to verify that a student does not exist when an unregistered studentId is search for.
        it('should return the student does not exist', async () => {
            let studentId = 'sTest';
            let expectedExists = false;
            let exists = await dbStudentController.checkStudentExists(studentId);
            assert.strictEqual(exists, expectedExists);
        }).timeout(10000);
    });
});