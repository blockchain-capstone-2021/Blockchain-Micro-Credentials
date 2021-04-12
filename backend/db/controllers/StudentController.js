const { models } = require('../models/index')
const createStudent = async (req, res, next) => {
    if (!req.body.studentId           ||
        !req.body.degreeId            ||
        !req.body.studentName         ||
        !req.body.studentEmail        ||
        !req.body.studentCreditPoints ||
        !req.body.passwordHash) 
        {
        res.locals['response'] = {
            success: 'false',
            message:'Student data is missing',
        }
    }

    const student = {
        studentId: req.body.studentId,
        degreeId: req.body.degreeId,
        studentName: req.body.studentName,
        studentEmail: req.body.studentEmail,
        studentCreditPoints: req.body.studentCreditPoints,
        passwordHash: req.body.passwordHash
    }

    await models.Question.create(student).then(student => {
        res.locals['response'] = {
            success: 'true',
            message: 'Student added successfully',
            student,
        }
    }).catch(err => {
        res.locals['response'] = {
            success: 'false',
            message:err,
        }
    })
    next()
};

const getStudents = async (req, res, next) => {
    await models.Student.findAll().then( students => {
        res.locals.students = students
    });
    console.log(res.locals.students);
    next();
}

module.exports = {
    createStudent,
    getStudents
}