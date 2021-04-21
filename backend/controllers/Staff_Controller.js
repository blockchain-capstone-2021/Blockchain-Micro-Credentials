const dbStaffController = require('../db/controllers/DbStaffController')
const SHA256 = require("crypto-js/sha256");

const submitStaffLogin = async (req, res, next) => {
    let _staffId = req.params.staffId.toLowerCase();
    let exists = await dbStaffController.checkStaffExists(_staffId);
    res.locals.exists = exists

    if(exists)
    {
        let staff = await dbStaffController.getStaff(_staffId)
        if(staff.passwordHash === SHA256(req.params.password).toString())
        {
            res.locals.loggedIn = true;
        }
        else
        {
            res.locals.loggedIn = false;
        }
    }
    next();
}

module.exports = {
    submitStaffLogin
}