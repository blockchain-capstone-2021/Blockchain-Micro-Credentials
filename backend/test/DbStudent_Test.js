const assert = require('assert');
const SequelizeMock = require('sequelize-mock');
var DBConnectionMock = new SequelizeMock();

const dbStudentController = require('../db/controllers/DbStudentController')

var StudentMock = DBConnectionMock.define('students', {
    'studentId': 's3710669',
    'degreeId': 'BP094',
    'studentName': 'Shrey Parekh',
    'studentEmail': 's3710669@student.rmit.edu.au',
    'studentCreditPoints': 252,
    'passwordHash': 'testingHash',
});

describe('Db Student Controller', () => {
    describe('getStudent()', () => {
        it('should return the correct student Id', async () => {
            let studentId = 's3710669'
            let student = await dbStudentController.getStudent(studentId)
            assert.strictEqual(student.studentId, studentId);
        }).timeout(10000);
        it('should return the incorrect student Id', async () => {
            let studentId = 's3710669'
            let expectedStudentId = "s3541003"
            let student = await dbStudentController.getStudent(studentId)
            assert.notStrictEqual(student.studentId, expectedStudentId);
        }).timeout(10000);
    })
    describe('checkStudentExists()', () => {
        it('should return the student exists', async () => {
            let studentId = 's3710669'
            let expectedExists = true
            let exists = await dbStudentController.checkStudentExists(studentId)
            assert.strictEqual(exists, expectedExists);
        }).timeout(10000);
        it('should return the student does not exist', async () => {
            let studentId = 'sTest'
            let expectedExists = false
            let exists = await dbStudentController.checkStudentExists(studentId)
            assert.strictEqual(exists, expectedExists);
        }).timeout(10000);
    })
    describe('updateCreditPoints()', () => {
        it('should return the correct credit points', async () => {
            let expectedCreditPoints = 264

            await updateCreditPoints("s3710669", 264)

            StudentMock.findOne({
                where: {
                    studentId: "s3710669"
                }
            }).then(function (student) {
                assert.strictEqual(student.get('studentCreditPoints'), expectedCreditPoints);
            })
            
        }).timeout(10000);
    })
});

async function updateCreditPoints(_studentId, _creditPoints)
{
    let student = await dbStudentController.getStudent(_studentId)
    let currentPoints = student.studentCreditPoints
    let updatedPoints = currentPoints + _creditPoints
    await StudentMock.update({ studentCreditPoints: updatedPoints}, {
        where: {
            studentId: _studentId
        }
    });
}