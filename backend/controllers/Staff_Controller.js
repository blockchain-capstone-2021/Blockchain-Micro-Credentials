const dbStaffController = require('../db/controllers/DbStaffController')
const SHA256 = require("crypto-js/sha256");

const submitStaffLogin = async (req, res, next) => {
    let _staffId = req.params.staffId.toLowerCase();
    await dbStaffController.checkStaffExists(_staffId).then(async (exists) => {
        res.locals.exists = exists;
        if(exists)
        {
            await dbStaffController.getStaff(_staffId).then(staff => {
                if(staff.passwordHash === SHA256(req.params.password).toString())
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
    submitStaffLogin
}