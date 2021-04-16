const { models } = require('../models/index')

//return a student for a given studentId
async function getStudent(_studentId) 
{
    let _student;

    await models.Student.findByPk(_studentId).then( student => {
        _student = student;
    });

    return _student;
}

//check if a student exists for a given studentId
async function checkStudentExists(_studentId) 
{
    const student = await getStudent(_studentId)

    let studentExists = false
    if(student){
        studentExists = true
    }

    return studentExists
}

//updates credit points by a specified amount
async function updateCreditPoints(_studentId, _creditPoints)
{
    let student = await getStudent(_studentId)
    let currentPoints = student.studentCreditPoints
    let updatedPoints = currentPoints + _creditPoints
    await models.Student.update({ studentCreditPoints: updatedPoints}, {
        where: {
            studentId: _studentId
        }
      });
}

module.exports = {
    getStudent,
    checkStudentExists,
    updateCreditPoints
}