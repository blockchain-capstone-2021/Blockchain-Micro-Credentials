const dbStudentController = require('../db/controllers/DbStudentController')
const dbDegreeController = require('../db/controllers/DbDegreeController')
const SHA256 = require("crypto-js/sha256");

const submitStudentLogin = async (req, res, next) => {
    try{
        let _studentId = req.params.studentId.toLowerCase();
        let exists = await dbStudentController.checkStudentExists(_studentId)
        res.locals.exists = exists;

        if(exists)
        {
            let student = await dbStudentController.getStudent(_studentId)
            if(student.passwordHash === SHA256(req.params.password).toString())
            {
                res.locals.loggedIn = true;
            }
            else
            {
                res.locals.loggedIn = false;
            }
        }

        res.locals.success = true
    }
    catch(err)
    {
        res.locals.success = false
    }
    finally{
        next();
    }
}

const getStudent = async (req, res, next) => {
    try{
        let student = await dbStudentController.getStudent(req.params.studentId)
        res.locals.student = student
        res.locals.degree = await dbDegreeController.getDegree(student.degreeId)
        res.locals.success = true
    }
    catch(err)
    {
        res.locals.success = false
    }
    finally{
        next();
    }
}

module.exports = {
    submitStudentLogin,
    getStudent
}   