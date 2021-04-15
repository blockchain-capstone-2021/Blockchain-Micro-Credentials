const { models } = require('../models/index')

//return a staff member for a given staffId
async function getStudent(_studentId) 
{
    let _student;

    await models.Student.findByPk(_studentId).then( student => {
        _student = student;
    });

    return _student;
}

//check if a staff member exists for a given staffId
async function checkStudentExists(_studentId) 
{
    const student = await getStudent(_studentId)

    let studentExists = false
    if(student){
        studentExists = true
    }

    return studentExists
}

async function updateCreditPoints(_studentId, _creditPoints)
{
    await models.Student.update({ studentCreditPoints: _creditPoints}, {
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