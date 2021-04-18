require('dotenv').config({
  path: ('../.env_address'),
  debug: process.env.DEBUG
})
const dbModuleController = require('../db/controllers/DbModuleController')
const dbModule_AttemptController = require('../db/controllers/DbModule_AttemptController')
const ipfs = require('../middleware/ipfs')
const moduleContract = require('../blockchain/build/contracts/Micro_Module.json')
const moduleTrackerContract = require('../blockchain/build/contracts/Micro_Module_Tracker.json')
const blockchain = require('../middleware/blockchain')
const utility = require('../utilities/Utility')
const Module_Key = require('../object_models/blockchain/Module_Key')

async function getAttemptNumbers(studentId, modules){
    let attemptsMap = new Map()

    for (const module of modules){
        await dbModule_AttemptController.getNoOfAttempts(studentId, module.moduleId).then(attempts=>{
            attemptsMap[module.moduleId] = attempts 
        });
    } 

    return attemptsMap;
}

async function getHighestScores(studentId, unitId, modules){

    let highestScoreMap = new Map()

    let currentSemester
    await utility.getCurrentSemester().then(_currentSemester => {
        currentSemester = _currentSemester
    })


    for (const module of modules){
        let modKey = new Module_Key(studentId, unitId, module.moduleId, currentSemester)
        let serialisedKey = JSON.stringify(modKey)
        await blockchain.checkExists(moduleTrackerContract, process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedKey).then(async (exists) => {
            if (!exists)
            {
                highestScoreMap[module.moduleId] = `0/${module.noOfQuestions}`
            }
            else
            {
                await blockchain.getHashFromContract(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
                    process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedKey).then(async (hash) => {
                        await ipfs.ipfsGetData(hash).then(data =>{
                            let deserialisedModule = JSON.parse(data)
                            highestScoreMap[module.moduleId] = `${deserialisedModule._result}/${module.noOfQuestions}`
                        });
                    });
            }
        });
    }

    return highestScoreMap
}

const getModules = async (req, res, next)=>{

    await dbModuleController.getModulesByUnit(req.params.unitId).then(async (modules) => {
        res.locals.modules = modules
        
        await getAttemptNumbers(req.params.studentId, modules).then(map =>{
            res.locals.attemptsMap = map
        })

        await getHighestScores(req.params.studentId, req.params.unitId, modules).then(map =>{
            res.locals.highestScoreMap = map
        })

    });
    next();
}

module.exports = {
    getModules
}