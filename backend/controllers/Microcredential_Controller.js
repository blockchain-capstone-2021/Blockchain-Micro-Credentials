require('dotenv').config({
    path: ('../.env'),
    debug: process.env.DEBUG
});
const dbDegreeController = require('../db/controllers/DbDegreeController');
const dbStudentController = require('../db/controllers/DbStudentController');
const dbUnitController = require('../db/controllers/DbUnitController');
const dbModuleController = require('../db/controllers/DbModuleController');
const unitContract = require('../blockchain/build/contracts/Unit.json');
const unitTrackerContract = require('../blockchain/build/contracts/Unit_Tracker.json');
const microCredContract = require('../blockchain/build/contracts/Micro_Credential.json');
const microCredTrackerContract = require('../blockchain/build/contracts/Micro_Credential_Tracker.json');
const moduleContract = require('../blockchain/build/contracts/Micro_Module.json');
const moduleTrackerContract = require('../blockchain/build/contracts/Micro_Module_Tracker.json');
const blockchain = require('../middleware/blockchain');
const ipfs = require('../middleware/ipfs');
const emailService = require('../services/Email_Service');
const Module_Key = require('../object_models/blockchain/Module_Key');
const MicroCred_Key = require('../object_models/blockchain/ManualEntry_Key');
const Unit_Key = require('../object_models/blockchain/Unit_Key');
const MicroCred_Data = require('../object_models/ipfs/ManualEntry');
const Unit_Data = require('../object_models/ipfs/Unit');
const IncompleteModules = require('../exceptions/IncompleteModules');

//submit a microcredential for a given student, unit, and enrolment period (semester)
const submitMicroCred = async (req, res, next) => {
    try {
        let result = await calculateScore(req.params.studentId, req.params.unitId, req.params.enrolmentPeriod);
        await submitScore(result.moduleIndices, req.params.studentId, req.params.unitId, req.params.enrolmentPeriod, result.finalResult);

        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
        if (err.name == 'IncompleteModules') {
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


//calculate microcredential score for a given student, unit, and semester
async function calculateScore(studentId, unitId, currentSemester) {
    let moduleIndices = [];
    let finalResult = 0;

    let modules = await dbModuleController.getModulesByUnit(unitId);

    for (const module of modules) {
        //create module key object
        let modKey = new Module_Key(studentId, unitId, module.moduleId, currentSemester);
        //convert key object to JSON
        let serialisedModKey = JSON.stringify(modKey);
        //check if key exists on blockchain
        let exists = await blockchain.checkExists(moduleTrackerContract, process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedModKey);

        if (exists) {
            //retrieve index of module
            let index = await blockchain.getHashIndex(moduleTrackerContract, process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedModKey);
            moduleIndices.push(index);

            //retrieve IPFS hash from blockchain
            let hash = await blockchain.getHashFromContract(moduleContract, moduleTrackerContract, process.env.MICRO_MODULE_ADDRESS,
                process.env.MICRO_MODULE_TRACKER_ADDRESS, serialisedModKey);
            //retrieve JSON object from IPFS using hash
            let modData = await ipfs.ipfsGetData(hash);
            //deserialise JSON object
            let deserialisedModule = JSON.parse(modData);
            //calculate module result
            let result = parseFloat(deserialisedModule._result) / parseFloat(module.noOfQuestions);
            //calculate unit result
            finalResult += (result * parseFloat(module.weight));
        }
        else {
            throw new IncompleteModules("Sorry, the micro-credential cannot be submitted as there are unattempted modules. Please attempt all modules before submission!");
        }
    }
    return { moduleIndices, finalResult };
}

//submit microcredential result for a given student and unit
async function submitScore(moduleIndices, studentId, unitId, currentSemester, finalResult) {
    //create microcredential object
    let microCredData = new MicroCred_Data(moduleIndices, studentId, unitId, currentSemester, finalResult);
    //convert object to JSON
    let serialisedMicroCredData = JSON.stringify(microCredData);
    //store JSON object on IPFS and retrieve hash
    let microCredHash = await ipfs.ipfsStoreData(serialisedMicroCredData);
    //create microcredential key object
    let microCredKey = new MicroCred_Key(studentId, unitId, currentSemester);
    //convert key object to JSON
    let serialisedMicroCredKey = JSON.stringify(microCredKey);
    //store IPFS hash and key on blockchain
    await blockchain.addHashToContractWithTracker(microCredContract, microCredTrackerContract, process.env.MICRO_CREDENTIAL_ADDRESS,
        process.env.MICRO_CREDENTIAL_TRACKER_ADDRESS, microCredHash, serialisedMicroCredKey);
    //retrieve index of blockchain entry
    let index = await blockchain.getHashIndex(microCredTrackerContract, process.env.MICRO_CREDENTIAL_TRACKER_ADDRESS, serialisedMicroCredKey);
    //trigger unit submission
    await submitUnit(currentSemester, studentId, unitId, finalResult, index);
}

//submit unit result for given student and unit
async function submitUnit(currentSemester, studentId, unitId, finalResult, microCredIndex) {
    //creat unit object
    let unitData = new Unit_Data(microCredIndex, undefined, studentId, unitId, currentSemester, finalResult);
    //convert object to JSON
    let serialisedUnitData = JSON.stringify(unitData);
    //store JSON object on IPFS and retrieve hash
    let unitHash = await ipfs.ipfsStoreData(serialisedUnitData);
    //create unit key object
    let unitKey = new Unit_Key(studentId, unitId, currentSemester);
    //convert key object to JSON
    let serialisedUnitKey = JSON.stringify(unitKey);
    //store IPFS hash and key on blockchain
    await blockchain.addHashToContractWithTracker(unitContract, unitTrackerContract, process.env.UNIT_ADDRESS,
        process.env.UNIT_TRACKER_ADDRESS, unitHash, serialisedUnitKey);
    //evaluate student performance on unit
    await evaluatePerformance(studentId, unitId, finalResult);
}

//evaluate given student's performance and send applicable email
async function evaluatePerformance(studentId, unitId, finalResult) {
    let unit = await dbUnitController.getUnit(unitId);
    let creditPoints = 0;

    //check if student passed
    if (finalResult >= unit.unitPassMark) {
        creditPoints = unit.unitCreditPoints;
    }

    await dbStudentController.updateCreditPoints(studentId, creditPoints);

    let student = await dbStudentController.getStudent(studentId);
    let degree = await dbDegreeController.getDegree(student.degreeId);

    if (student.studentCreditPoints >= degree.totalCreditPoints) {
        //if student has enough credit points to complete degree
        emailService.sendDegreeEmail(studentId, unitId).catch(err => {
            console.log("Email Service Error");
        });
    } else if (student.studentCreditPoints % (degree.creditPointsPerSem * 2) == 0) {
        //if student has enough credit points to complete  year
        emailService.sendYearEmail(studentId, unitId).catch(err => {
            console.log("Email Service Error");
        });
    } else if (student.studentCreditPoints % degree.creditPointsPerSem == 0) {
        //if student has enough credit points to complete semester
        emailService.sendSemesterEmail(studentId, unitId).catch(err => {
            console.log("Email Service Error");
        });
    } else if (creditPoints > 0) {
        //if student completed unit
        emailService.sendUnitEmail(studentId, unitId).catch(err => {
            console.log("Email Service Error");
        });
    } else {
        //if student failed unit
        emailService.sendFailEmail(studentId, unitId).catch(err => {
            console.log("Email Service Error");
        });
    }
}

module.exports = {
    submitMicroCred
};