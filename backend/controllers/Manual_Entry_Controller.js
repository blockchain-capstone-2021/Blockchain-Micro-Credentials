require('dotenv').config({
    path: ('../.env_address'),
    debug: process.env.DEBUG
  })
const dbDegreeController = require('../db/controllers/DbDegreeController')
const dbStudentController = require('../db/controllers/DbStudentController')
const dbUnitController = require('../db/controllers/DbUnitController')
const unitContract = require('../blockchain/build/contracts/Unit.json')
const unitTrackerContract = require('../blockchain/build/contracts/Unit_Tracker.json')
const manualContract = require('../blockchain/build/contracts/Manual_Entry.json')
const manualTrackerContract = require('../blockchain/build/contracts/Manual_Entry_Tracker.json')
const blockchain = require('../middleware/blockchain')
const ipfs = require('../middleware/ipfs')
const utility = require('../utilities/Utility')
const ManualEntry_Key = require('../object_models/blockchain/ManualEntry_Key')
const Unit_Key = require('../object_models/blockchain/Unit_Key')
const ManualEntry_Data = require('../object_models/ipfs/ManualEntry')
const Unit_Data = require('../object_models/ipfs/Unit')

const submitManualEntry = async (req, res, next)=>{
    try{
        currentSemester = await utility.getCurrentSemester()
        await submitScore(currentSemester, req.params.studentId, req.params.unitId, req.params.finalResult)

        res.locals.success = true
    }
    catch(err){
        res.locals.success = false
    }
    finally{
        next();
    }
}

async function submitScore(currentSemester, studentId, unitId, finalResult){
    let manualEntryData = new ManualEntry_Data(studentId, unitId, currentSemester, finalResult)
    let serialisedManualEntryData = JSON.stringify(manualEntryData)
    let manualEntryHash = await ipfs.ipfsStoreData(serialisedManualEntryData)
    let manualEntryKey = new ManualEntry_Key(studentId, unitId, currentSemester)
    let serialisedManualEntryKey = JSON.stringify(manualEntryKey)
    
    await blockchain.addHashToContractWithTracker(manualContract, manualTrackerContract, process.env.MANUAL_ENTRY_ADDRESS, 
        process.env.MANUAL_ENTRY_TRACKER_ADDRESS, manualEntryHash, serialisedManualEntryKey)

    let index = await blockchain.getHashIndex(manualTrackerContract, process.env.MANUAL_ENTRY_TRACKER_ADDRESS, serialisedManualEntryKey)
    await submitUnit(currentSemester, studentId, unitId, finalResult, index)
}

async function submitUnit(currentSemester, studentId, unitId, finalResult, manualEntryIndex){
    let unitData = new Unit_Data(undefined, manualEntryIndex, studentId, unitId, currentSemester, finalResult)
    let serialisedUnitData = JSON.stringify(unitData)
    let unitHash = await ipfs.ipfsStoreData(serialisedUnitData)
    let unitKey = new Unit_Key(studentId, unitId, currentSemester)
    let serialisedUnitKey = JSON.stringify(unitKey)

    await blockchain.addHashToContractWithTracker(unitContract, unitTrackerContract, process.env.UNIT_ADDRESS, 
        process.env.UNIT_TRACKER_ADDRESS, unitHash, serialisedUnitKey)

    await evaluatePerformance(studentId, unitId, finalResult)
}

async function evaluatePerformance(studentId, unitId, finalResult){

    let unit = await dbUnitController.getUnit(unitId)

    let creditPoints = 0
    if(finalResult >= unit.unitPassMark){
        creditPoints = unit.unitCreditPoints
    }
    
    await dbStudentController.updateCreditPoints(studentId, creditPoints)

    let student = await dbStudentController.getStudent(studentId)
    let degree = await dbDegreeController.getDegree(student.degreeId)

    if(student.studentCreditPoints >= degree.totalCreditPoints){ 
        //if student has enough credit points to complete degree
        console.log("Degree complete")
    }else if (student.studentCreditPoints % (degree.creditPointsPerSem * 2) == 0){ 
        //if student has enough credit points to complete  year
        console.log("Year complete")
    }else if(student.studentCreditPoints % degree.creditPointsPerSem == 0){ 
        //if student has enough credit points to complete semester
        console.log("Semester complete")
    }else if(creditPoints > 0){ 
        //if student completed unit
        console.log("Unit complete")
    }else{ 
        //if student failed unit
        console.log("Unit failed")
    }
}

//TESTING FUNCTION REMOVE LATER
// async function seedData(studentId, creditPoints)
// {
//     await dbStudentController.updateCreditPoints(studentId, creditPoints).then(async ()=>{console.log("finished")});
// }

module.exports = {
    submitManualEntry
}