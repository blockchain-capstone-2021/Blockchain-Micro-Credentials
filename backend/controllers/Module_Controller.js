require('dotenv').config({
  path: ('../.env_address'),
  debug: process.env.DEBUG
})
const dbModuleController = require('../db/controllers/DbModuleController')
const dbModule_AttemptController = require('../db/controllers/DbModule_AttemptController')
const dbAnswerController = require('../db/controllers/DbAnswerController')
const dbQuestionController = require('../db/controllers/DbQuestionController')
const ipfs = require('../middleware/ipfs')
const moduleContract = require('../blockchain/build/contracts/Micro_Module.json')
const moduleTrackerContract = require('../blockchain/build/contracts/Micro_Module_Tracker.json')
const questionAnswerContract = require('../blockchain/build/contracts/QA.json')
const blockchain = require('../middleware/blockchain')
const utility = require('../utilities/Utility')
const Module_Key = require('../object_models/blockchain/Module_Key')
const QA_Data = require('../object_models/ipfs/QA')
const Module_Data = require('../object_models/ipfs/MicroModule')

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

// const submitModule = async (req, res, next)=>{
   
//     await dbModuleController.getModule(req.params.moduleId).then(async (module)=>{
//         let moduleNo = module.moduleNo
//         await submitQAPairs(req.params.studentId, req.params.unitId, req.params.enrolmentPeriod, req.params.attemptNo, 
//             moduleNo, req.params.qAList).then(async (result) => {
//             submitAttempt(result.qAIndices, req.params.studentId, req.params.unitId, moduleNo, module.moduleId, 
//                 req.params.enrolmentPeriod, req.params.attemptNo, result.score).then(async () => {
//                     await dbModule_AttemptController.incrementAttempts(studentId, module.moduleId)
//             })
//         })
//     })
//     next();
// }

async function submitModule(moduleId, studentId, unitId, enrolmentPeriod, attemptNo, qAList){
   
    await dbModuleController.getModule(moduleId).then(async (module)=>{
        let moduleNo = module.moduleNo
        console.log(moduleNo)
        await submitQAPairs(studentId, unitId, enrolmentPeriod, attemptNo, 
            moduleNo, qAList).then(async (result) => {
            console.log(result.qAIndices)
            console.log(result.score)
            submitAttempt(result.qAIndices, studentId, unitId, moduleNo, module.moduleId, 
                enrolmentPeriod, attemptNo, result.score).then(async () => {
                    await dbModule_AttemptController.incrementAttempts(studentId, module.moduleId).then(() => {console.log("increased by 1")})
            })
        })
    })
}

async function submitQAPairs(studentId, unitId, currentSemester, attemptNo, moduleNo, qAList)
{
    let score = 0
    let qAIndices = []

    console.log(qAList)
    for(let i = 0; i<qAList.length; i++){
        let qAData = qAList[i].toString().split("_")
        let isCorrect = qAData[2]
        let questionId = parseInt(qAData[0].substr(1, qAData[0].length-1))
        let answerId = parseInt(qAData[1].substr(1, qAData[1].length-1))

        let questionContent 
        let providedAnswer
        let correctAnswer
        
        await dbQuestionController.getQuestion(questionId).then(async (question)=>{
            questionContent = question.content
            await dbAnswerController.getAnswer(answerId).then(async (answer)=>{
                providedAnswer = answer.content
                if(isCorrect == "true"){
                    score++
                    correctAnswer = providedAnswer
                }else{
                    await dbAnswerController.getCorrectAnswer(questionId).then(_correctAnswer => {
                        correctAnswer = _correctAnswer.content
                    })
                }
                await addQABlock(questionContent, providedAnswer, correctAnswer, studentId, 
                    unitId, moduleNo, currentSemester, attemptNo).then(async () => {
                        await blockchain.getLatestIndex(questionAnswerContract, process.env.QA_ADDRESS).then(latestIndex =>{
                            qAIndices.push(latestIndex)
                        })
                })
            })
        })   
    }

    return {qAIndices, score}
}

async function addQABlock(question, providedAnswer, correctAnswer, studentId, unitId, moduleNo, currentSemester, attemptNo){
    let qAData = new QA_Data(question, providedAnswer, correctAnswer, studentId, unitId, moduleNo, currentSemester, attemptNo)
    let serialisedQAData = JSON.stringify(qAData)
    await ipfs.ipfsStoreData(serialisedQAData).then(async (qAHash) =>{
        await blockchain.addHashToContractWithOutTracker(questionAnswerContract, process.env.QA_ADDRESS, qAHash)
    })
}

async function submitAttempt(qAList, studentId, unitId, moduleNo, moduleId, currentSemester, attemptNo, result){
    let modData = new Module_Data(qAList, studentId, unitId, moduleNo, currentSemester, attemptNo, result)
    let serialisedModData = JSON.stringify(modData)
    await ipfs.ipfsStoreData(serialisedModData).then(async (newHash) => {
        let modKey = new Module_Key(studentId, unitId, moduleId, currentSemester)
        let serialisedKey = JSON.stringify(modKey)
        await blockchain.checkExists(moduleTrackerContract, process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedKey).then(async (exists) => {
            if (!exists)
            {
                await blockchain.addHashToContractWithTracker(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
                    process.env.MICRO_MODULE_TRACKER_ADDRESS, newHash, serialisedKey).then(() => {console.log("Add because does not exist")})
            }
            else
            {
                await blockchain.getHashFromContract(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
                    process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedKey).then(async (exisitngHash) => {
                        await ipfs.ipfsGetData(exisitngHash).then(async (data) =>{
                            let deserialisedModule = JSON.parse(data)
                            if(deserialisedModule._result >= result)
                            {
                                await blockchain.addHashToContractWithOutTracker(moduleContract, process.env.MICRO_MODULE_ADDRESS, newHash).then(() => {
                                    console.log("exists but new score is not better")
                                })
                            }
                            else
                            {
                                await blockchain.addHashToContractWithTracker(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
                                    process.env.MICRO_MODULE_TRACKER_ADDRESS, newHash, serialisedKey).then(() => {
                                        console.log("exists but new score is better")
                                    })
                            }
                        });
                });
            }
        });
    })
}

//(moduleId, studentId, unitId, enrolmentPeriod, attemptNo, qAList)
submitModule(1,"s3541003","COSC2536","Y2021S1",1,["q1_a4_true", "q2_a6_true","q3_a10_true","q4_a13_true","q5_a20_true","q6_a22_false","q7_a25_false","q8_a32_false","q9_a35_false","q10_a37_false"])

module.exports = {
    getModules,
    submitModule
}