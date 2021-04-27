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
const AttemptsExist = require('../exceptions/AttemptsExist')
const InsufficientQuestions = require('../exceptions/InsufficientQuestions')

async function getAttemptNumbers(studentId, modules){
    let attemptsMap = new Map()
    let currentSemester = await utility.getCurrentSemester()

    for (const module of modules){
        attemptsMap[module.moduleId] = await dbModule_AttemptController.getNoOfAttempts(studentId, module.moduleId, currentSemester)
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

const getModulesForStudent = async (req, res, next)=>{

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

const getModulesForStaff = async (req, res, next)=>{

    try{
        let modules = await dbModuleController.getModulesByUnit(req.params.unitId)

        res.locals.modules = modules
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
        let module = await dbModuleController.getModule(parseInt(req.body.moduleId))
        let qAList = req.body.qAPairs
        let moduleNo = module.moduleNo
        let result = await submitQAPairs(req.body.studentId, req.body.unitId, req.body.enrolmentPeriod, parseInt(req.body.attemptNo), moduleNo, parseInt(req.body.moduleId), qAList)
        await submitAttempt(result.qAIndices, req.body.studentId, req.body.unitId, moduleNo, module.moduleId, req.body.enrolmentPeriod, parseInt(req.body.attemptNo), result.score)
    
        await dbModule_AttemptController.incrementAttempts(req.body.studentId, module.moduleId, req.body.enrolmentPeriod)

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

const unpublishModule = async(req, res, next)=>{ 
    try{
        let currentSemester = await utility.getCurrentSemester()

        let attempt = await dbModule_AttemptController.checkAttemptsExist(req.params.moduleId, currentSemester)

        if(attempt === null)
        {
            await dbModuleController.updateModuleState(req.params.moduleId, false)
        }
        else
        {
            throw new AttemptsExist("Sorry, students have already begun attempting the module. This module cannot be unpublished.")
        }
        res.locals.success = true
    }
    catch(err){
        res.locals.success = false
        if (err.name == 'AttemptsExist') {
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

const publishModule = async(req, res, next)=>{ 
    try{
        let noOfQuestions = await dbQuestionController.getQuestionsCount(req.params.moduleId)

        let module = await dbModuleController.getModule(req.params.moduleId)

        if(noOfQuestions >= module.noOfQuestions)
        {
            await dbModuleController.updateModuleState(req.params.moduleId, true)
        }
        else
        {
            let difference = module.noOfQuestions - noOfQuestions
            throw new InsufficientQuestions(`Sorry, this module cannot be published. This module requires ${module.noOfQuestions}, and only ${noOfQuestions} have been provided. 
            Please add ${difference} question(s), and then retry publishing the module`)
        }
        res.locals.success = true
    }
    catch(err){
        res.locals.success = false
        if (err.name == 'InsufficientQuestions') {
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

module.exports = {
    getModulesForStudent,
    getUnitModules,
    submitModule,
    getModulesForStaff, 
    unpublishModule,
    publishModule
}