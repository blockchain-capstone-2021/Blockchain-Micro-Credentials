require('dotenv').config({
    path: ('../.env'),
    debug: process.env.DEBUG
});
const dbEnrolmentController = require('../db/controllers/DbEnrolmentController');
const dbStudentController = require('../db/controllers/DbStudentController');
const dbUnitController = require('../db/controllers/DbUnitController');
const unitContract = require('../blockchain/build/contracts/Unit.json');
const unitTrackerContract = require('../blockchain/build/contracts/Unit_Tracker.json');
const blockchain = require('../middleware/blockchain');
const ipfs = require('../middleware/ipfs');
const utility = require('../utilities/Utility');
const Unit_Key = require('../object_models/blockchain/Unit_Key');

//get all enrolments for a given student
const getEnrolmentsByStudent = async (req, res, next) => {
    try {
        let currentSemester = await utility.getCurrentSemester();
        let enrolments = await dbEnrolmentController.getEnrolmentsByStudent(req.params.studentId, currentSemester);
        let unitMap = new Map();
        let availableEnrolments = [];
        let unavailableEnrolments = [];

        for (const enrolment of enrolments) {
            let unit = await dbUnitController.getUnit(enrolment.unitId);
            unitMap.set(unit.unitId, unit.unitName);

            //create unit key object
            let unitKey = new Unit_Key(enrolment.studentId, enrolment.unitId, currentSemester);
            //convert object to JSON
            let serialisedKey = JSON.stringify(unitKey);
            //check if key exists on blockchain
            let exists = await blockchain.checkExists(unitTrackerContract, process.env.UNIT_TRACKER_ADDRESS, serialisedKey);

            //if key does not exist, add enrolment to available enrolments
            //else, add to unavailable enrolments
            if (!exists) {
                availableEnrolments.push(enrolment);
            }
            else {
                unavailableEnrolments.push(enrolment);
            }
        }
        res.locals.unitMap = unitMap;
        res.locals.availableEnrolments = availableEnrolments;
        res.locals.unavailableEnrolments = unavailableEnrolments;
        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
    }
    finally {
        next();
    }
};

//get all enrolments for a given unit
const getEnrolmentsByUnit = async (req, res, next) => {
    try {
        let availableStudents = [];
        let unavailableStudents = [];
        let studentScoreMap = new Map();

        let currentSemester = await utility.getCurrentSemester();

        let enrolments = await dbEnrolmentController.getEnrolmentsByUnit(req.params.unitId, currentSemester);

        for (const enrolment of enrolments) {
            //create unit key object
            let unitKey = new Unit_Key(enrolment.studentId, enrolment.unitId, currentSemester);
            //convert key object to JSON
            let serialisedKey = JSON.stringify(unitKey);
            //check if key exists on blockchain
            let exists = await blockchain.checkExists(unitTrackerContract, process.env.UNIT_TRACKER_ADDRESS, serialisedKey);
            let student = await dbStudentController.getStudent(enrolment.studentId);

            //if key does not exist, add enrolment to available enrolments
            //else, add to unavailable enrolments and retrieve student's final result via blockchain and IPFS
            if (!exists) {
                availableStudents.push(student);
            }
            else {
                unavailableStudents.push(student);

                //retrieve IPFS hash from blockchain
                let hash = await blockchain.getHashFromContract(unitContract, unitTrackerContract, process.env.UNIT_ADDRESS,
                    process.env.UNIT_TRACKER_ADDRESS, serialisedKey);
                //retrieve JSON object from IPFS
                let data = await ipfs.ipfsGetData(hash);
                //deserialise JSON object
                let deserialisedUnit = JSON.parse(data);
                //add unit to map of student scores
                studentScoreMap.set(student.studentId, deserialisedUnit._finalResult);
            }
        }
        res.locals.availableStudents = availableStudents;
        res.locals.unavailableStudents = unavailableStudents;
        res.locals.studentScoreMap = studentScoreMap;
        res.locals.success = true;
    }
    catch (err) {
        res.locals.success = false;
    }
    finally {
        next();
    }
};

module.exports = {
    getEnrolmentsByStudent,
    getEnrolmentsByUnit
};