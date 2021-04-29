require('dotenv').config({
    path: ('../.env'),
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
const IncompleteModules = require('../exceptions/IncompleteModules')

const submitMicroCred = async (req, res, next)=>{
    try{
        await generateScore(req.params.studentId, req.params.unitId, req.params.enrolmentPeriod)

        res.locals.success = true
    }
    catch(err){
        res.locals.success = false
        if (err.name == 'IncompleteModules') {
            res.locals.customError = true
            res.locals.errorMessage = err.message
        }
        else{
            res.locals.customError = false
        }
    }
    finally{
        next();
    }
}

async function generateScore(studentId, unitId, currentSemester){
    let result = await calculateScore(studentId, unitId, currentSemester)
    await submitScore(result.moduleIndices, studentId, unitId, currentSemester, result.finalResult)
}


async function calculateScore(studentId, unitId, currentSemester){
    let moduleIndices = []
    let finalResult = 0

    let modules = await dbModuleController.getModulesByUnit(unitId)

    for (const module of modules)
        {
            let modKey = new Module_Key(studentId, unitId, module.moduleId, currentSemester)
            let serialisedModKey = JSON.stringify(modKey)
            let exists = await blockchain.checkExists(moduleTrackerContract, process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedModKey)
            if (exists)
            {
                let index = await blockchain.getHashIndex(moduleTrackerContract, process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedModKey)
                moduleIndices.push(index)
    
                let hash = await blockchain.getHashFromContract(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
                    process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedModKey)
                let modData = await ipfs.ipfsGetData(hash)
                let deserialisedModule = JSON.parse(modData)
                let result = parseFloat(deserialisedModule._result)/parseFloat(module.noOfQuestions)
                finalResult += (result * parseFloat(module.weight))
            }
            else
            {
                throw new IncompleteModules("Sorry, the micro-credential cannot be submitted as there are unattempted modules. Please attempt all modules before submission!")
            }
        }
    return {moduleIndices, finalResult};
}

async function submitScore(moduleIndices, studentId, unitId, currentSemester, finalResult){
    let microCredData = new MicroCred_Data(moduleIndices, studentId, unitId, currentSemester, finalResult)
    let serialisedMicroCredData = JSON.stringify(microCredData)
    let microCredHash = await ipfs.ipfsStoreData(serialisedMicroCredData)
    let microCredKey = new MicroCred_Key(studentId, unitId, currentSemester)
    let serialisedMicroCredKey = JSON.stringify(microCredKey)

    await blockchain.addHashToContractWithTracker(microCredContract, microCredTrackerContract, process.env.MICRO_CREDENTIAL_ADDRESS, 
        process.env.MICRO_CREDENTIAL_TRACKER_ADDRESS, microCredHash, serialisedMicroCredKey)

    let index = await blockchain.getHashIndex(microCredTrackerContract, process.env.MICRO_CREDENTIAL_TRACKER_ADDRESS, serialisedMicroCredKey)
    await submitUnit(currentSemester, studentId, unitId, finalResult, index)
}

async function submitUnit(currentSemester, studentId, unitId, finalResult, microCredIndex){
    let unitData = new Unit_Data(microCredIndex, undefined, studentId, unitId, currentSemester, finalResult)
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
    submitMicroCred
}