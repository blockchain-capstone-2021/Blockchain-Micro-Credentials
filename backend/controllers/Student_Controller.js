const dbStudentController = require('../db/controllers/DbStudentController')
const SHA256 = require("crypto-js/sha256");

const submitStudentLogin = async (req, res, next) => {
    let _studentId = req.params.studentId.toLowerCase();
    await dbStudentController.checkStudentExists(_studentId).then(async (exists) => {
        res.locals.exists = exists;
        if(exists)
        {
            await dbStudentController.getStudent(_studentId).then(student => {
                if(student.passwordHash === SHA256(req.params.password).toString())
                {
                    res.locals.loggedIn = true;
                }
                else
                {
                    res.locals.loggedIn = false;
                }
            });
        }
    });
    next();
}

module.exports = {
    submitStudentLogin
}