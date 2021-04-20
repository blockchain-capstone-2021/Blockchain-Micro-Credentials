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

    await utility.getCurrentSemester().then(async (currentSemester) => {
        await submitScore(currentSemester, req.params.studentId, req.params.unitId, req.params.finalResult)
    })
    next();
}

async function submitScore(currentSemester, studentId, unitId, finalResult){
    let manualEntryData = new ManualEntry_Data(studentId, unitId, currentSemester, finalResult)
    let serialisedManualEntryData = JSON.stringify(manualEntryData)
    await ipfs.ipfsStoreData(serialisedManualEntryData).then(async (manualEntryHash) =>{
        let manualEntryKey = new ManualEntry_Key(studentId, unitId, currentSemester)
        let serialisedManualEntryKey = JSON.stringify(manualEntryKey)
        await blockchain.addHashToContractWithTracker(manualContract, manualTrackerContract, process.env.MANUAL_ENTRY_ADDRESS, 
            process.env.MANUAL_ENTRY_TRACKER_ADDRESS, manualEntryHash, serialisedManualEntryKey).then(async ()=>{
                await blockchain.getHashIndex(manualTrackerContract, process.env.MANUAL_ENTRY_TRACKER_ADDRESS, serialisedManualEntryKey).then(async (index)=>{
                    await submitUnit(currentSemester, studentId, unitId, finalResult, index)
                })
            })
        
    })
}

async function submitUnit(currentSemester, studentId, unitId, finalResult, manualEntryIndex){
    let unitData = new Unit_Data(undefined, manualEntryIndex, studentId, unitId, currentSemester, finalResult)
    let serialisedUnitData = JSON.stringify(unitData)
    await ipfs.ipfsStoreData(serialisedUnitData).then(async (unitHash) =>{
        let unitKey = new Unit_Key(studentId, unitId, currentSemester)
        let serialisedUnitKey = JSON.stringify(unitKey)
        await blockchain.addHashToContractWithTracker(unitContract, unitTrackerContract, process.env.UNIT_ADDRESS, 
            process.env.UNIT_TRACKER_ADDRESS, unitHash, serialisedUnitKey).then(async ()=>{
                await evaluatePerformance(studentId, unitId, finalResult)
        })
    })
}

async function evaluatePerformance(studentId, unitId, finalResult){

    await dbUnitController.getUnit(unitId).then(async (unit) =>{
        let creditPoints = 0
        if(finalResult >= unit.unitPassMark){
            creditPoints = unit.unitCreditPoints
        }
        await dbStudentController.updateCreditPoints(studentId, creditPoints).then(async ()=>{
            await dbStudentController.getStudent(studentId).then(async (student) =>{
                await dbDegreeController.getDegree(student.degreeId).then(degree =>{ 
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
                })
            })
        })
    })
}

//TESTING FUNCTION REMOVE LATER
// async function seedData(studentId, creditPoints)
// {
//     await dbStudentController.updateCreditPoints(studentId, creditPoints).then(async ()=>{console.log("finished")});
// }

module.exports = {
    submitManualEntry
}