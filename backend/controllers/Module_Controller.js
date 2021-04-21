require('dotenv').config({
  path: ('../.env'),
  debug: process.env.DEBUG
})
const dbModuleController = require('../db/controllers/DbModuleController')
const dbModule_AttemptController = require('../db/controllers/DbModule_AttemptController')
const dbAnswerController = require('../db/controllers/DbAnswerController')
const dbQuestionController = require('../db/controllers/DbQuestionController')
const ipfs = require('../middleware/ipfs')
const moduleContract = require('../blockchain/build/contracts/Micro_Module.json')
const moduleTrackerContract = require('../blockchain/build/contracts/Micro_Module_Tracker.json')
const questionAnswerTrackerContract = require('../blockchain/build/contracts/QA_Tracker.json')
const questionAnswerContract = require('../blockchain/build/contracts/QA.json')
const blockchain = require('../middleware/blockchain')
const utility = require('../utilities/Utility')
const Module_Key = require('../object_models/blockchain/Module_Key')
const QA_Key = require('../object_models/blockchain/QA_Key')
const QA_Data = require('../object_models/ipfs/QA')
const Module_Data = require('../object_models/ipfs/MicroModule')

async function getAttemptNumbers(studentId, modules){
    let attemptsMap = new Map()

    for (const module of modules){
        attemptsMap[module.moduleId] = await dbModule_AttemptController.getNoOfAttempts(studentId, module.moduleId)
    } 

    return attemptsMap;
}

async function getHighestScores(studentId, unitId, modules){

    let highestScoreMap = new Map()
    let currentSemester = await utility.getCurrentSemester()

    for (const module of modules){
        let modKey = new Module_Key(studentId, unitId, module.moduleId, currentSemester)
        let serialisedKey = JSON.stringify(modKey)
        let exists = await blockchain.checkExists(moduleTrackerContract, process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedKey)

        if (!exists)
        {
            highestScoreMap[module.moduleId] = `0/${module.noOfQuestions}`
        }
        else
        {
            let hash = await blockchain.getHashFromContract(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
                process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedKey)
            let data = await ipfs.ipfsGetData(hash)
            let deserialisedModule = JSON.parse(data)
            highestScoreMap[module.moduleId] = `${deserialisedModule._result}/${module.noOfQuestions}`
        }
    }

    return highestScoreMap
}

const getUnitModules = async (req, res, next) => {
    // Method that doesnt tie in student ID
    try {

        const modules = await dbModuleController.getModulesByUnit(req.params.unitId)
        res.locals = {
            success: true,
            modules: modules
        }
        res.locals.modules = modules
        res.locals.success = true

    } catch (err) {
        console.log(err);
        res.locals.success = false
    } finally {
        next();
    }
}

const getModules = async (req, res, next)=>{

    try{
        let modules = await dbModuleController.getModulesByUnit(req.params.unitId)

        res.locals.modules = modules
        
        res.locals.attemptsMap = await getAttemptNumbers(req.params.studentId, modules)
        res.locals.highestScoreMap = await getHighestScores(req.params.studentId, req.params.unitId, modules)

        res.locals.success = true
    }
    catch(err){
        res.locals.success = false
    }
    finally{
        next();
    }
}

const submitModule = async(req, res, next)=>{
    try{
        let module = await dbModuleController.getModule(parseInt(req.params.moduleId))
        let qAList = req.body.qAPairs
        let moduleNo = module.moduleNo
        let result = await submitQAPairs(req.params.studentId, req.params.unitId, req.params.enrolmentPeriod, parseInt(req.params.attemptNo), moduleNo, parseInt(req.params.moduleId), qAList)
        await submitAttempt(result.qAIndices, req.params.studentId, req.params.unitId, moduleNo, module.moduleId, req.params.enrolmentPeriod, parseInt(req.params.attemptNo), result.score)
    
        await dbModule_AttemptController.incrementAttempts(req.params.studentId, module.moduleId)

        res.locals.success = true
    }
    catch(err){
        res.locals.success = false
    }
    finally{
        next();
    }
}

async function submitQAPairs(studentId, unitId, currentSemester, attemptNo, moduleNo, moduleId, qAList)
{
    let score = 0
    let qAIndices = []

    for(let i = 0; i<qAList.length; i++){
        let qAData = qAList[i].toString().split("_")
        let isCorrect = qAData[2]
        let questionId = parseInt(qAData[0].substr(1, qAData[0].length-1))
        let answerId = parseInt(qAData[1].substr(1, qAData[1].length-1))

        let questionContent 
        let providedAnswer
        let correctAnswer
        
        let question = await dbQuestionController.getQuestion(questionId)
        questionContent = question.content

        let answer = await dbAnswerController.getAnswer(answerId)
        providedAnswer = answer.content

        if(isCorrect == "true"){
            score++
            correctAnswer = providedAnswer
        }else{
            correctAnswer = await dbAnswerController.getCorrectAnswer(questionId)
        }
        let index = await addQABlock(questionContent, question.questionId, providedAnswer, correctAnswer, studentId, 
            unitId, moduleNo, moduleId, currentSemester, attemptNo)

        qAIndices.push(index)
    }
    return {qAIndices, score}
}

async function addQABlock(question, questionId, providedAnswer, correctAnswer, studentId, unitId, moduleNo, moduleId, currentSemester, attemptNo){
    let qAData = new QA_Data(question, providedAnswer, correctAnswer, studentId, unitId, moduleNo, currentSemester, attemptNo)
    let serialisedQAData = JSON.stringify(qAData)
    let qAHash = await ipfs.ipfsStoreData(serialisedQAData)
    let qAKey = new QA_Key(studentId, unitId, moduleId, questionId, attemptNo, currentSemester)
    let serialisedQAKey = JSON.stringify(qAKey)
    await blockchain.addHashToContractWithTracker(questionAnswerContract, questionAnswerTrackerContract, process.env.QA_ADDRESS, 
        process.env.QA_TRACKER_ADDRESS, qAHash, serialisedQAKey)

    return await blockchain.getHashIndex(questionAnswerTrackerContract, process.env.QA_TRACKER_ADDRESS, serialisedQAKey)
}

async function submitAttempt(qAList, studentId, unitId, moduleNo, moduleId, currentSemester, attemptNo, result){
    let modData = new Module_Data(qAList, studentId, unitId, moduleNo, currentSemester, attemptNo, result)
    let serialisedModData = JSON.stringify(modData)
    let newHash = await ipfs.ipfsStoreData(serialisedModData)
    let modKey = new Module_Key(studentId, unitId, moduleId, currentSemester)
    let serialisedKey = JSON.stringify(modKey)

    let exists = await blockchain.checkExists(moduleTrackerContract, process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedKey)
    if (!exists){
        await blockchain.addHashToContractWithTracker(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
            process.env.MICRO_MODULE_TRACKER_ADDRESS, newHash, serialisedKey)
    }else{
        let existingHash = await blockchain.getHashFromContract(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
            process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedKey)

        let data = await ipfs.ipfsGetData(existingHash)

        let deserialisedModule = JSON.parse(data)
        if(deserialisedModule._result >= result)
        {
            await blockchain.addHashToContractWithOutTracker(moduleContract, process.env.MICRO_MODULE_ADDRESS, newHash)
        }
        else
        {
            await blockchain.addHashToContractWithTracker(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
                process.env.MICRO_MODULE_TRACKER_ADDRESS, newHash, serialisedKey)
        }
    }
}

module.exports = {
    getModules,
    getUnitModules,
    submitModule
}