const { models } = require('../models/index');

//return a student for a given studentId
async function getStudent(studentId) {
    let _student;

    await models.Student.findByPk(studentId).then(student => {
        _student = student;
    });

    return _student;
}

//check if a student exists for a given studentId
async function checkStudentExists(studentId) {
    const student = await getStudent(studentId);

    let studentExists = false;
    if (student) {
        studentExists = true;
    }

    return studentExists;
}

//updates credit points by a specified amount
async function updateCreditPoints(studentId, creditPoints) {
    let student = await getStudent(studentId);
    let currentPoints = student.studentCreditPoints;
    let updatedPoints = currentPoints + creditPoints;
    await models.Student.update({ studentCreditPoints: updatedPoints }, {
        where: {
            studentId: studentId
        }
    });
}

module.exports = {
    getStudent,
    checkStudentExists,
    updateCreditPoints
};