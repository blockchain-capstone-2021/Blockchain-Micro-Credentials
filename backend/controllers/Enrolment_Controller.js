require('dotenv').config({
  path: ('../.env_address'),
  debug: process.env.DEBUG
})
const dbEnrolmentController = require('../db/controllers/DbEnrolmentController')
const dbStudentController = require('../db/controllers/DbStudentController')
const dbUnitController = require('../db/controllers/DbUnitController')
const unitContract = require('../blockchain/build/contracts/Unit.json')
const unitTrackerContract = require('../blockchain/build/contracts/Unit_Tracker.json')
const blockchain = require('../middleware/blockchain')
const utility = require('../utilities/Utility')
const Unit_Key = require('../object_models/blockchain/Unit_Key')


const getEnrolmentsByStudent = async (req, res, next)=>{
    let currentSemester
    await utility.getCurrentSemester().then(_currentSemester => {
        currentSemester = _currentSemester
    })

    await dbEnrolmentController.getEnrolmentsByStudent(req.params.studentId, currentSemester).then(async (enrolments) =>{
        let unitMap = new Map()
        let availableEnrolments = []
        let unavailableEnrolments = []

        for (const enrolment of enrolments){
            await dbUnitController.getUnit(enrolment.unitId).then(unit=>{
                unitMap[unit.unitId] = unit.unitName
            })

            let unitKey = new Unit_Key(req.params.studentId, enrolments.unitId, currentSemester)
            let serialisedKey = JSON.stringify(unitKey)
            await blockchain.checkExists(unitTrackerContract, process.env.UNIT_TRACKER_ADDRESS, serialisedKey).then(async (exists) => {

                if (!exists)
                {
                    availableEnrolments.push(enrolment)
                }
                else
                {
                    unavailableEnrolments.push(enrolment)
                }
            });
        }
        res.locals.unitMap = unitMap
        res.locals.availableEnrolments = availableEnrolments
        res.locals.unavailableEnrolments = unavailableEnrolments
    })
    
    next();
}

const getEnrolmentsByUnit = async (req, res, next)=>{

    
    next();
}

module.exports = {
    getEnrolmentsByStudent,
    getEnrolmentsByUnit
}