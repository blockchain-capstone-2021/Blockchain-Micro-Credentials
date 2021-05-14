const assert = require('assert');

const sequelizeMock = require('sequelize-mock')
var DBConnectionMock = new sequelizeMock

var EnrolmentMock = DBConnectionMock.define('enrolments', {autoQueryfallback: false, stopPropagation: false});

EnrolmentMock.$queueResult(EnrolmentMock.build({
    studentId: "s3541003",
    unitId: 1,
    semOfEnrolment: "Y2021S1"
}));

EnrolmentMock.$queueResult(EnrolmentMock.build({
    studentId: "s3541003",
    unitId: 2,
    semOfEnrolment: "Y2021S1"
}));


describe('Enrolment', () => {

    describe('getEnrolmentsByStudent()', () =>{
        it('should return the enrolment with the correct enrolmentId', async () => {
            let expectedEnrolmentId = 1
            let studentId = "s3541003"
            let sem = "Y2021S1"
            let actualEnrolment = await getEnrolmentsByStudent(studentId, sem)
            let actualEnrolmentId = actualEnrolment.id
            assert.strictEqual(actualEnrolmentId, expectedEnrolmentId)
        }).timeout(10000);
    })

    describe('getEnrolmentsByUnit()', () =>{
        it('should return the enrolment with the correct enrolmentId', async () => {
            let expectedEnrolmentId = 2
            let unitId = 2
            let sem = "Y2021S1"
            let actualEnrolment = await getEnrolmentsByUnit(unitId, sem)
            let actualEnrolmentId = actualEnrolment.id
            assert.strictEqual(actualEnrolmentId, expectedEnrolmentId)
        }).timeout(10000);
    })
  
})


//return all enrolments for a given studentId
async function getEnrolmentsByStudent(_studentId, _semOfEnrol) 
{
    let _enrolments;

    await EnrolmentMock.findAll({
        where: {
          studentId: _studentId,
          semOfEnrolment: _semOfEnrol
        }
      }).then( enrolments => {
        _enrolments = enrolments;
    });

    return _enrolments;
}

//return all enrollments for a given unitId
async function getEnrolmentsByUnit(_unitId, _semOfEnrol) 
{
  let _enrolments;

  await EnrolmentMock.findAll({
      where: {
        unitId: _unitId,
        semOfEnrolment: _semOfEnrol
      }
    }).then( enrolments => {
      _enrolments = enrolments;
  });

  return _enrolments;
}