require('dotenv').config({
    path: ('../.env_address'),
    debug: process.env.DEBUG
})
const dbDegreeController = require('../db/controllers/DbDegreeController')
const dbStudentController = require('../db/controllers/DbStudentController')
const dbUnitController = require('../db/controllers/DbUnitController')
const dbModuleController = require('../db/controllers/DbModuleController')
const unitContract = require('../blockchain/build/contracts/Unit.json')
const unitTrackerContract = require('../blockchain/build/contracts/Unit_Tracker.json')
const microCredContract = require('../blockchain/build/contracts/Micro_Credential.json')
const microCredTrackerContract = require('../blockchain/build/contracts/Micro_Credential_Tracker.json')
const moduleContract = require('../blockchain/build/contracts/Micro_Module.json')
const moduleTrackerContract = require('../blockchain/build/contracts/Micro_Module_Tracker.json')
const blockchain = require('../middleware/blockchain')
const ipfs = require('../middleware/ipfs')
const Module_Key = require('../object_models/blockchain/Module_Key')
const MicroCred_Key = require('../object_models/blockchain/ManualEntry_Key')
const Unit_Key = require('../object_models/blockchain/Unit_Key')
const MicroCred_Data = require('../object_models/ipfs/ManualEntry')
const Unit_Data = require('../object_models/ipfs/Unit')

const submitMicroCred = async (req, res, next)=>{

    await generateScore(req.params.studentId, req.params.unitId, req.params.enrolmentPeriod)

    next();
}

async function generateScore(studentId, unitId, currentSemester){
    await calculateScore(studentId, unitId, currentSemester).then(async (result) => {
        await submitScore(result.moduleIndices, studentId, unitId, currentSemester, result.finalResult)
    })
}


async function calculateScore(studentId, unitId, currentSemester){
    let moduleIndices = []
    let finalResult = 0

    await dbModuleController.getModulesByUnit(unitId).then(async (modules) => {
        for (const module in modules)
        {
            let modKey = new Module_Key(studentId, unitId, module.moduleId, currentSemester)
            let serialisedModKey = JSON.stringify(modKey)
            await blockchain.getHashIndex(moduleTrackerContract, process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedModKey).then(async (index) => {
                moduleIndices.push(index)
                await blockchain.getHashFromContract(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
                    process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedModKey).then(async (hash) => {
                        await ipfs.ipfsGetData(hash).then(modData => {
                            let deserialisedModule = JSON.parse(modData)
                            finalResult += deserialisedModule._result
                        });
                    });
            })
        }
    })
    return {moduleIndices, finalResult};
}

async function submitScore(moduleIndices, studentId, unitId, currentSemester, finalResult){
    let microCredData = new MicroCred_Data(moduleIndices, studentId, unitId, currentSemester, finalResult)
    let serialisedMicroCredData = JSON.stringify(microCredData)
    await ipfs.ipfsStoreData(serialisedMicroCredData).then(async (microCredHash) =>{
        let microCredKey = new MicroCred_Key(studentId, unitId, currentSemester)
        let serialisedMicroCredKey = JSON.stringify(microCredKey)
        await blockchain.addHashToContractWithTracker(microCredContract, microCredTrackerContract, process.env.MICRO_CREDENTIAL_ADDRESS, 
            process.env.MICRO_CREDENTIAL_TRACKER_ADDRESS, microCredHash, serialisedMicroCredKey).then(async ()=>{
                await blockchain.getHashIndex(microCredTrackerContract, process.env.MICRO_CREDENTIAL_TRACKER_ADDRESS, serialisedMicroCredKey).then(async (index)=>{
                    await submitUnit(currentSemester, studentId, unitId, finalResult, index)
                })
            })  
    })
}

async function submitUnit(currentSemester, studentId, unitId, finalResult, microCredIndex){
    let unitData = new Unit_Data(microCredIndex, undefined, studentId, unitId, currentSemester, finalResult)
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
    submitMicroCred
}