require('dotenv').config({
    path: ('../.env'),
    debug: process.env.DEBUG
});
const dbModuleController = require('../db/controllers/DbModuleController');
const dbModule_AttemptController = require('../db/controllers/DbModule_AttemptController');
const dbAnswerController = require('../db/controllers/DbAnswerController');
const dbQuestionController = require('../db/controllers/DbQuestionController');
const ipfs = require('../middleware/ipfs');
const moduleContract = require('../blockchain/build/contracts/Micro_Module.json');
const moduleTrackerContract = require('../blockchain/build/contracts/Micro_Module_Tracker.json');
const questionAnswerTrackerContract = require('../blockchain/build/contracts/QA_Tracker.json');
const questionAnswerContract = require('../blockchain/build/contracts/QA.json');
const blockchain = require('../middleware/blockchain');
const utility = require('../utilities/Utility');
const ModuleBest_Key = require('../object_models/blockchain/ModuleBest_Key');
const Module_Key = require('../object_models/blockchain/Module_Key');
const QA_Key = require('../object_models/blockchain/QA_Key');
const QA_Data = require('../object_models/ipfs/QA');
const Module_Data = require('../object_models/ipfs/MicroModule');
const AttemptsExist = require('../exceptions/AttemptsExist');
const InsufficientQuestions = require('../exceptions/InsufficientQuestions');
const questionController = require('../controllers/Question_Controller');

//return a map of modules and the number of attempts a given student has had on each
async function getAttemptNumbers(studentId, modules) {
    let attemptsMap = new Map();
    let currentSemester = await utility.getCurrentSemester();

    for (const module of modules) {
        let attemptNo = await dbModule_AttemptController.getNoOfAttempts(studentId, module.moduleId, currentSemester);
        attemptsMap.set(module.moduleId, attemptNo);
    }

    return attemptsMap;
}

//return a map of modules and a given student's highest score
async function getHighestScores(studentId, unitId, modules) {

    let highestScoreMap = new Map();
    let currentSemester = await utility.getCurrentSemester();

    for (const module of modules) {
        //create module key object
        let modKey = new ModuleBest_Key(studentId, unitId, module.moduleId, currentSemester);
        //convert key object to JSON
        let serialisedKey = JSON.stringify(modKey);
        //check if key exists on blockchain
        let exists = await blockchain.checkExists(moduleTrackerContract, process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedKey);

        //if key does not exist, set highest score to zero
        //else, retrieve student's highest score via blockchain and IPFS
        if (!exists) {
            highestScoreMap.set(module.moduleId, `0/${module.noOfQuestions}`);
        }
        else {
            //retrieve IPFS hash from blockchain
            let hash = await blockchain.getHashFromContract(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
                process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedKey);
            //retrieve JSON object from IPFS
            let data = await ipfs.ipfsGetData(hash);
            //deserialise JSON object
            let deserialisedModule = JSON.parse(data);
            //add score to highest score map
            highestScoreMap.set(module.moduleId, `${deserialisedModule._result}/${module.noOfQuestions}`);
        }
    }

    return highestScoreMap;
}

//return module by module id
const getModule = async (req, res, next) => {
    try {
        let module = await dbModuleController.getModule(parseInt(req.params.moduleId));

        res.locals.module = module;
        res.locals.success = true;
    }
    catch (err) {
        console.log(err);
        res.locals.success = false;
    } finally {
        next();
    }
};

//return all modules for a given student and unit
const getModulesForStudent = async (req, res, next) => {

    try {
        let modules = await dbModuleController.getModulesByUnit(req.params.unitId);

        res.locals.modules = modules;

        res.locals.attemptsMap = await getAttemptNumbers(req.params.studentId, modules);

        //Verify whether the micro-credential is submittable.
        if (Array.from(res.locals.attemptsMap.values()).includes(0)) {
            res.locals.submittable = false;
        }
        else {
            res.locals.submittable = true;
        }

        //retrieve student's highest score for each module
        let highestScoreMap = await getHighestScores(req.params.studentId, req.params.unitId, modules);
        res.locals.highestScoreMap = highestScoreMap;

        //retrieve student's current total unit score
        let cumulativeScore = await getCumulativeScore(highestScoreMap);
        res.locals.cumulativeScore = cumulativeScore;
        res.locals.finalGrade = await getFinalGrade(cumulativeScore);

        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
    }
    finally {
        next();
    }
};

//return student's current total unit score
async function getCumulativeScore(highestScoreMap) {
    let grade = 0;
    for (const [moduleId, highestScore] of highestScoreMap.entries()) {
        let module = await dbModuleController.getModule(moduleId);
        //deliminate highest score by '/' (eg '5/10' becomes [5,10])
        let scores = highestScore.split("/");
        //calculate percentage score
        let modulePercentageScore = parseFloat(scores[0]) / parseFloat(scores[1]);
        //calculate current total unit score
        grade += (modulePercentageScore * parseFloat(module.weight));
    }
    //to two decimal places
    grade = grade.toFixed(2);

    return grade;
}

//return relavant letter grade code when given numerical grade
async function getFinalGrade(score) {
    let grade = "NN";
    if (score >= 80) {
        grade = "HD";
    } else if (score >= 70) {
        grade = "DI";
    } else if (score >= 60) {
        grade = "CR";
    } else if (score >= 50) {
        grade = "PA";
    }

    return grade;
}

//return total number of available questions in question bank
async function getCountOfQuestions(modules) {
    let availableQuestions = new Map();

    for (const module of modules) {
        let questionCount = await dbQuestionController.getQuestionsCount(module.moduleId);
        availableQuestions.set(module.moduleId, questionCount);
    }

    return availableQuestions;
}

//return all modules and their question bank size for a given unit 
const getModulesForStaff = async (req, res, next) => {
    try {
        let modules = await dbModuleController.getModulesByUnit(req.params.unitId);

        res.locals.modules = modules;
        res.locals.availableQuestions = await getCountOfQuestions(modules);
        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
    }
    finally {
        next();
    }
};

//submit a module for a given; student, unit, semester, attempt, and module id
const submitModule = async (req, res, next) => {
    try {
        let module = await dbModuleController.getModule(parseInt(req.body.moduleId));
        let qAList = req.body.qAPairs;
        let moduleNo = module.moduleNo;
        let result = await submitQAPairs(req.body.studentId, req.body.unitId, req.body.enrolmentPeriod, parseInt(req.body.attemptNo), moduleNo, parseInt(req.body.moduleId), qAList);
        await submitAttempt(result.qAIndices, req.body.studentId, req.body.unitId, moduleNo, module.moduleId, req.body.enrolmentPeriod, parseInt(req.body.attemptNo), result.score);

        await dbModule_AttemptController.incrementAttempts(req.body.studentId, module.moduleId, req.body.enrolmentPeriod);

        res.locals.success = true;
    }
    catch (err) {
        console.log(err);
        res.locals.success = false;
    }
    finally {
        next();
    }
};

//update the number of questions that are displayed to a student during a quiz from the question bank
const updateModuleNoOfQuestions = async (req, res, next) => {
    try {
        await dbModuleController.updateNoOfQuestions(req.params.moduleId, req.params.noOfQuestions);
        res.locals.success = true;
    }
    catch (err) {
        console.log(err);
        res.locals.success = false;
    }
    finally {
        next();
    }
};

//submit all Q/A pairs and calculate and return the final module score
async function submitQAPairs(studentId, unitId, currentSemester, attemptNo, moduleNo, moduleId, qAList) {
    let score = 0;
    let qAIndices = [];

    for (let i = 0; i < qAList.length; i++) {
        //deliminate each Q/A pair to obtain question id, answer id, and whether the answer is true or false
        let qAData = qAList[i].toString().split("_");
        let isCorrect = qAData[2];
        let questionId = parseInt(qAData[0].substr(1, qAData[0].length - 1));
        let answerId = parseInt(qAData[1].substr(1, qAData[1].length - 1));

        let correctAnswer;

        //store correct answer
        //if answer is correct, increment student's score 
        if (isCorrect == "true") {
            score++;
            correctAnswer = answerId;
        } else {
            correctAnswer = await dbAnswerController.getCorrectAnswer(questionId);
            correctAnswer = correctAnswer.answerId;
        }
        //retrieve index of blockchain entry
        let index = await addQABlock(questionId, answerId, correctAnswer, studentId,
            unitId, moduleNo, moduleId, currentSemester, attemptNo);

        //return the blockchain index and the associated score
        qAIndices.push(index);
    }
    return { qAIndices, score };
}

//retrieve the index of a Q/A blockchain entry
async function addQABlock(questionId, providedAnswerId, correctAnswerId, studentId, unitId, moduleNo, moduleId, currentSemester, attemptNo) {
    //create Q/A object
    let qAData = new QA_Data(questionId, providedAnswerId, correctAnswerId, studentId, unitId, moduleNo, currentSemester, attemptNo);
    //convert object to JSON
    let serialisedQAData = JSON.stringify(qAData);
    //store JSON object on IPFS and retrieve hash
    let qAHash = await ipfs.ipfsStoreData(serialisedQAData);
    //create Q/A key object
    let qAKey = new QA_Key(studentId, unitId, moduleId, questionId, attemptNo, currentSemester);
    //convert key object to JSON
    let serialisedQAKey = JSON.stringify(qAKey);
    //store IPFS hash and key on blockchain
    await blockchain.addHashToContractWithTracker(questionAnswerContract, questionAnswerTrackerContract, process.env.QA_ADDRESS,
        process.env.QA_TRACKER_ADDRESS, qAHash, serialisedQAKey);
    //retrieve index of blockchain entry
    return await blockchain.getHashIndex(questionAnswerTrackerContract, process.env.QA_TRACKER_ADDRESS, serialisedQAKey);
}

//store attempt result and track best result
async function submitAttempt(qAList, studentId, unitId, moduleNo, moduleId, currentSemester, attemptNo, result) {
    //create module object
    let modData = new Module_Data(qAList, studentId, unitId, moduleNo, currentSemester, attemptNo, result);
    //convert object to JSON
    let serialisedModData = JSON.stringify(modData);
    //store JSON object on IPFS and retrieve hash
    let newHash = await ipfs.ipfsStoreData(serialisedModData);
    //create module key object
    let modKeyBest = new ModuleBest_Key(studentId, unitId, moduleId, currentSemester);
    //convert key object to JSON
    let serialisedKeyBest = JSON.stringify(modKeyBest);
    //check if key exists on blockchain
    let exists = await blockchain.checkExists(moduleTrackerContract, process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedKeyBest);
    //if key does not exist, store IPFS hash and key on blockchain
    //else, get current hash and compare results, storing whichever is better
    if (!exists) {
        await blockchain.addHashToContractWithTracker(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
            process.env.MICRO_MODULE_TRACKER_ADDRESS, newHash, serialisedKeyBest);
    } else {
        //retrieve existing IPFS hash from blockchain
        let existingHash = await blockchain.getHashFromContract(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
            process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedKeyBest);
        //retrieve JSON object from IPFS
        let data = await ipfs.ipfsGetData(existingHash);
        //deserialise JSON object
        let deserialisedModule = JSON.parse(data);
        //compare new and existing results
        //if new score is higher, replace as tracked highest score on blockchain, and create a regular module tracker for the previos high score
        //if new score is lower, simply create a regular module tracker for it
        if (deserialisedModule._result >= result) {
            //create module key object
            let modKey = new Module_Key(studentId, unitId, moduleId, currentSemester, attemptNo);
            //convert key object to JSON
            let serialisedKey = JSON.stringify(modKey);

            //store result on blockchain but do not track as best result
            await blockchain.addHashToContractWithTracker(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
                process.env.MICRO_MODULE_TRACKER_ADDRESS, newHash, serialisedKey);
        } else {
            //retrieve attempt number from the previous best result
            let prevBestAttemptNo = deserialisedModule._attemptNo;
            //create module key object for the previous best result
            let modKey = new Module_Key(studentId, unitId, moduleId, currentSemester, prevBestAttemptNo);
            //convert key object to JSON
            let serialisedKey = JSON.stringify(modKey);

            //store and track previous best result on blockchain as a regular result
            await blockchain.addHashToContractWithTracker(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
                process.env.MICRO_MODULE_TRACKER_ADDRESS, existingHash, serialisedKey);

            //store and track new best result on blockchain
            await blockchain.addHashToContractWithTracker(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
                process.env.MICRO_MODULE_TRACKER_ADDRESS, newHash, serialisedKeyBest);
        }
    }
}

//unbublish a given module
const unpublishModule = async (req, res, next) => {
    try {
        let currentSemester = await utility.getCurrentSemester();

        let attempt = await dbModule_AttemptController.checkAttemptsExist(req.params.moduleId, currentSemester);

        //if no attempts have been made, allow module to be unpublished
        //else, return error message
        if (attempt === null) {
            await dbModuleController.updateModuleState(req.params.moduleId, false);
        }
        else {
            throw new AttemptsExist("Sorry, students have already begun attempting the module. This module cannot be unpublished.");
        }
        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
        if (err.name == 'AttemptsExist') {
            res.locals.customError = true;
            res.locals.errorMessage = err.message;
        }
        else {
            res.locals.customError = false;
        }
    }
    finally {
        next();
    }
};

//publish a given module
const publishModule = async (req, res, next) => {
    try {
        let noOfQuestions = await dbQuestionController.getQuestionsCount(req.params.moduleId);

        let module = await dbModuleController.getModule(req.params.moduleId);

        //if the module has a sufficient number of questions, allow it to be published
        //else, return error message
        if (noOfQuestions >= module.noOfQuestions) {
            await dbModuleController.updateModuleState(req.params.moduleId, true);
        }
        else {
            let difference = module.noOfQuestions - noOfQuestions;
            throw new InsufficientQuestions(`Sorry, this module cannot be published. This module requires ${module.noOfQuestions} questions, and only ${noOfQuestions} have been provided. 
            Please add ${difference} question(s), and then retry publishing the module`);
        }
        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
        if (err.name == 'InsufficientQuestions') {
            res.locals.customError = true;
            res.locals.errorMessage = err.message;
        }
        else {
            res.locals.customError = false;
        }
    }
    finally {
        next();
    }
};

//Common method to get the best attempt
async function retrieveBestAttempt(studentId, unitId, moduleId, currentSemester) {
    //Create the best attempt key
    let modKeyBest = new ModuleBest_Key(studentId, unitId, moduleId, currentSemester);
    let serialisedKeyBest = JSON.stringify(modKeyBest);
    //Get the hash from the contract
    let bestHash = await blockchain.getHashFromContract(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
        process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedKeyBest);
    //Get the data with hash from IPFS
    let data = await ipfs.ipfsGetData(bestHash);

    let deserialisedModule = JSON.parse(data);
    //Common method to get the attempt's required data. Returns an object.
    let retrievedData = await retrieveAttemptData(deserialisedModule);
    //From the returned object populate local variables of the required data
    let questions = retrievedData.questions;
    let providedAnswerMap = retrievedData.providedAnswerMap;
    let answersMap = retrievedData.answersMap;
    let score = deserialisedModule._result;
    //Return an object populated with the local variables of the needed data.
    return { questions, providedAnswerMap, answersMap, score };
}

//Common method to get the attempt's required data. Returns an object
async function retrieveAttemptData(deserialisedModule) {
    let qAObjects = [];
    let questions = [];
    let providedAnswerMap = new Map();
    //Get each QA Pair for the attempt from the blockchain
    for (const index of deserialisedModule._qAList) {
        let hash = await blockchain.getHashWithIndex(questionAnswerContract, process.env.QA_ADDRESS, index);
        //retrieve JSON object from IPFS
        let qAData = await ipfs.ipfsGetData(hash);
        //deserialise JSON object
        let deserialisedQA = JSON.parse(qAData);

        qAObjects.push(deserialisedQA);
    }
    //For each QA pair get the question and associate the question id with the provided answer's id.
    for (const qAObject of qAObjects) {
        let question = await dbQuestionController.getQuestion(qAObject._question);
        questions.push(question);
        providedAnswerMap.set(qAObject._question, qAObject._providedAnswer);
    }
    //For all the questions get all the associated answers
    let answersMap = await questionController.getAnswers(questions);
    //Return an object of the collected data.
    return { questions, providedAnswerMap, answersMap };
}

//Method to get the best attempt to module
const getBestAttempt = async (req, res, next) => {
    try {
        //Call the common best attempt method. Returns an object with the data needed
        let retrievedAttempt = await retrieveBestAttempt(req.params.studentId, req.params.unitId, parseInt(req.params.moduleId), req.params.currentSemester);
        //From the returned object return to the view the data needed
        res.locals.questions = retrievedAttempt.questions;
        res.locals.answersMap = retrievedAttempt.answersMap;
        res.locals.providedAnswerMap = retrievedAttempt.providedAnswerMap;
        res.locals.score = retrievedAttempt.score;
        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
    }
    finally {
        next();
    }
};

const getAttempt = async (req, res, next) => {
    try {
        //Create the module key for the given attempt
        let modKey = new Module_Key(req.params.studentId, req.params.unitId, parseInt(req.params.moduleId), req.params.currentSemester, parseInt(req.params.attemptNo));
        let serialisedKey = JSON.stringify(modKey);

        let exists = await blockchain.checkExists(moduleTrackerContract, process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedKey);
        //If the created key exists, than it is not the best attempt.
        if (!exists) {
            //Created key does not exists and hence it is the best attempt. Get the best attempt via the common method. Returning an object  
            let retrievedAttempt = await retrieveBestAttempt(req.params.studentId, req.params.unitId, parseInt(req.params.moduleId), req.params.currentSemester);
            //From the returned object return to the view the data needed
            res.locals.questions = retrievedAttempt.questions;
            res.locals.answersMap = retrievedAttempt.answersMap;
            res.locals.providedAnswerMap = retrievedAttempt.providedAnswerMap;
            res.locals.score = retrievedAttempt.score;
        }
        else {
            //If the key exists than get that attempt number's hash
            let hash = await blockchain.getHashFromContract(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
                process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedKey);
            //Get the module attempt object from IPFS with hash
            let data = await ipfs.ipfsGetData(hash);

            let deserialisedModule = JSON.parse(data);
            //Get the data needed for that attempt with the common method. Returing an object.
            let retrievedData = await retrieveAttemptData(deserialisedModule);
            //From the returned object return to the view the data needed
            res.locals.questions = retrievedData.questions;
            res.locals.providedAnswerMap = retrievedData.providedAnswerMap;
            res.locals.answersMap = retrievedData.answersMap;
            res.locals.score = deserialisedModule._result;
        }
        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
    } finally {
        next();
    }
};

module.exports = {
    getModule,
    getModulesForStudent,
    submitModule,
    getModulesForStaff,
    unpublishModule,
    publishModule,
    updateModuleNoOfQuestions,
    getBestAttempt,
    getAttempt
};