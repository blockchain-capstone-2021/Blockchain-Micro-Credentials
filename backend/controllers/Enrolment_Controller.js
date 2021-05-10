require('dotenv').config({
  path: ('../.env'),
  debug: process.env.DEBUG
})
const dbEnrolmentController = require('../db/controllers/DbEnrolmentController')
const dbStudentController = require('../db/controllers/DbStudentController')
const dbUnitController = require('../db/controllers/DbUnitController')
const unitContract = require('../blockchain/build/contracts/Unit.json')
const unitTrackerContract = require('../blockchain/build/contracts/Unit_Tracker.json')
const blockchain = require('../middleware/blockchain')
const ipfs = require('../middleware/ipfs')
const utility = require('../utilities/Utility')
const Unit_Key = require('../object_models/blockchain/Unit_Key')

const getEnrolmentsByStudent = async (req, res, next)=>{
    try{
        let currentSemester = await utility.getCurrentSemester()
        let enrolments = await dbEnrolmentController.getEnrolmentsByStudent(req.params.studentId, currentSemester)
        let unitMap = new Map()
        let availableEnrolments = []
        let unavailableEnrolments = []
        
        for (const enrolment of enrolments){
            let unit  = await dbUnitController.getUnit(enrolment.unitId)
            unitMap.set(unit.unitId,unit.unitName)
    
            let unitKey = new Unit_Key(enrolment.studentId, enrolment.unitId, currentSemester)
            let serialisedKey = JSON.stringify(unitKey)
            let exists = await blockchain.checkExists(unitTrackerContract, process.env.UNIT_TRACKER_ADDRESS, serialisedKey)
            
            if (!exists)
            {
                availableEnrolments.push(enrolment)
            }
            else
            {
                unavailableEnrolments.push(enrolment)
            }
        }
        res.locals.unitMap = unitMap
        res.locals.availableEnrolments = availableEnrolments
        res.locals.unavailableEnrolments = unavailableEnrolments
        res.locals.success = true
    }
    catch(err){
        console.log(err);
        res.locals.success = false
    }
    finally{
        next();
    }
}

const getEnrolmentsByUnit = async (req, res, next)=>{
    try{
        let availableStudents = []
        let unavailableStudents = []
        let studentScoreMap = new Map()

        let currentSemester = await utility.getCurrentSemester()

        let enrolments = await dbEnrolmentController.getEnrolmentsByUnit(req.params.unitId, currentSemester)

        for (const enrolment of enrolments){
            let enrolKey = new Unit_Key(enrolment.studentId, enrolment.unitId, currentSemester)
            let serialisedKey = JSON.stringify(enrolKey)

            let exists = await blockchain.checkExists(unitTrackerContract, process.env.UNIT_TRACKER_ADDRESS, serialisedKey)
            let student = await dbStudentController.getStudent(enrolment.studentId)
            if (!exists)
            {   
                availableStudents.push(student)
            }
            else
            {
                unavailableStudents.push(student)  
                
                let hash = await blockchain.getHashFromContract(unitContract, unitTrackerContract, process.env.UNIT_ADDRESS,
                    process.env.UNIT_TRACKER_ADDRESS, serialisedKey)

                let data = await ipfs.ipfsGetData(hash)
                let deserialisedUnit = JSON.parse(data)
                studentScoreMap.set(student.studentId, deserialisedUnit._finalResult)
            }
        }
        res.locals.availableStudents = availableStudents;
        res.locals.unavailableStudents = unavailableStudents;
        res.locals.studentScoreMap = studentScoreMap;
        res.locals.success = true
    }
    catch(err){
        console.log(err);
        res.locals.success = false
    }
    finally{
        next();
    }
}

module.exports = {
    getEnrolmentsByStudent,
    getEnrolmentsByUnit
}