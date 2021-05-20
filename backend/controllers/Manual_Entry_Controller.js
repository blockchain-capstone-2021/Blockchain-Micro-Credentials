require('dotenv').config({
    path: ('../.env'),
    debug: process.env.DEBUG
});
const dbDegreeController = require('../db/controllers/DbDegreeController');
const dbStudentController = require('../db/controllers/DbStudentController');
const dbUnitController = require('../db/controllers/DbUnitController');
const unitContract = require('../blockchain/build/contracts/Unit.json');
const unitTrackerContract = require('../blockchain/build/contracts/Unit_Tracker.json');
const manualContract = require('../blockchain/build/contracts/Manual_Entry.json');
const manualTrackerContract = require('../blockchain/build/contracts/Manual_Entry_Tracker.json');
const blockchain = require('../middleware/blockchain');
const ipfs = require('../middleware/ipfs');
const utility = require('../utilities/Utility');
const emailService = require('../services/Email_Service');
const ManualEntry_Key = require('../object_models/blockchain/ManualEntry_Key');
const Unit_Key = require('../object_models/blockchain/Unit_Key');
const ManualEntry_Data = require('../object_models/ipfs/ManualEntry');
const Unit_Data = require('../object_models/ipfs/Unit');

//submit given manual score for a given student and unit
const submitManualEntry = async (req, res, next) => {
    try {
        currentSemester = await utility.getCurrentSemester();
        //submit manual entry score
        await submitScore(currentSemester, req.params.studentId, req.params.unitId, parseInt(req.params.finalResult));

        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
    }
    finally {
        next();
    }
};

//submit given manual score for given student, unit, and semester
async function submitScore(currentSemester, studentId, unitId, finalResult) {
    //create manual entry object
    let manualEntryData = new ManualEntry_Data(studentId, unitId, currentSemester, finalResult);
    //convert object to JSON
    let serialisedManualEntryData = JSON.stringify(manualEntryData);
    //store JSON object on IPFS and retrieve hash
    let manualEntryHash = await ipfs.ipfsStoreData(serialisedManualEntryData);
    //create manual entry key object
    let manualEntryKey = new ManualEntry_Key(studentId, unitId, currentSemester);
    //convert key object to JSON
    let serialisedManualEntryKey = JSON.stringify(manualEntryKey);
    //store IPFS hash and key on blockchain
    await blockchain.addHashToContractWithTracker(manualContract, manualTrackerContract, process.env.MANUAL_ENTRY_ADDRESS,
        process.env.MANUAL_ENTRY_TRACKER_ADDRESS, manualEntryHash, serialisedManualEntryKey);
    //retrieve index of blockchain entry
    let index = await blockchain.getHashIndex(manualTrackerContract, process.env.MANUAL_ENTRY_TRACKER_ADDRESS, serialisedManualEntryKey);
    //trigger unit submission
    await submitUnit(currentSemester, studentId, unitId, finalResult, index);
}

//submit unit result for given student and unit
async function submitUnit(currentSemester, studentId, unitId, finalResult, manualEntryIndex) {
    //creat unit object
    let unitData = new Unit_Data(undefined, manualEntryIndex, studentId, unitId, currentSemester, finalResult);
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
    submitManualEntry
};