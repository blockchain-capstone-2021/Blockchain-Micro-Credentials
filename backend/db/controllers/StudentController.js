const { models } = require('../models/index')
const createStudent = async (req, res, next) => {
    console.log(req.body)
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

    await models.Student.create(student).then(student => {
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

const deleteStudent = async (req, res, next) => {
    await models.Student.destroy({where: {studentId: req.params.id}}).then(student => {
        res.locals.response = {
            success: 'true',
            message: 'Student has been deleted successfully!'
        }
    }).catch(err => {
        res.locals.response = {
            success: 'false',
            message:err,
        }
    })
    next()
}

const updateStudent = async (req, res, next) => {
    await models.Student.findAll({where: {studentId:req.params.id}}).then(async student => {
        const newStudent = {
            studentId: !req.body.studentId ? student.studentId : req.body.studentId,
            degreeId: !req.body.degreeId ? student.degreeId : req.body.degreeId,
            studentName: !req.body.studentName ? student.studentName : req.body.studentName,
            studentEmail: !req.body.studentEmail ? student.studentEmail : req.body.studentEmail,
            studentCreditPoints: !req.body.studentCreditPoints ? student.studentCreditPoints : req.body.studentCreditPoints,
            passwordHash: !req.body.passwordHash ? student.passwordHash : req.body.passwordHash
        }

        await models.Student.update(newStudent, {where: {studentId: req.body.studentId}}).then(updatedStudent => {
            res.locals['response'] = {
                success: 'true',
                message: 'Student updated successfully',
                updatedStudent,
            }
        }).catch(err => {
            res.locals['response'] = {
                success: 'false',
                message:err,
            }
        })
        next()
        })

    };

const getStudents = async (req, res, next) => {
    await models.Student.findAll().then( students => {
        res.locals.students = students
    });
    next();
}

const getStudent = async (req, res, next) => {
    await models.Student.findAll({where: {studentId:req.params.id}}).then(student => {
        res.locals.student = student
    });
    next();
}

const getStudentEnrolments = async (req, res, next) => {
    await models.Enrolment.findAll({where: {studentId:req.params.id}}).then(enrolments => {
        res.locals.enrolments = enrolments
    });
    next();
}

const updateCreditPoints = async (req, res, next) => {
    await models.Student.update(
        {studentCreditPoints: parseInt(req.body.studentCreditPoints)},
        {returning:true, where: {studentId: req.params.id}}
        ).then(function([ rowsUpdate, [updatedBook] ]) {
            
            res.locals.student = student
        })
    next();
}


module.exports = {
    createStudent,
    getStudents,
    getStudent,
    deleteStudent,
    getStudentEnrolments,
    updateStudent
}
