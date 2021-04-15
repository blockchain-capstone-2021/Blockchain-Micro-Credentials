const { models } = require('../models/index')

//return a staff member for a given staffId
async function getStaff(_staffId) 
{
    let _staff;

    await models.Staff.findByPk(_staffId).then( staff => {
        _staff = staff;
    });

    return _staff;
}

//check if a staff member exists for a given staffId
async function checkStaffExists(_staffId) 
{
    const staff = await getStaff(_staffId)

    let staffExists = false
    if(staff){
      staffExists = true
    }

    return staffExists
}


module.exports = {
    getStaff,
    checkStaffExists
}