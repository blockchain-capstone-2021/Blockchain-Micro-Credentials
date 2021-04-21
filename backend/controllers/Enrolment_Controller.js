require('dotenv').config({
  path: ('../.env'),
  debug: process.env.DEBUG
})
const dbEnrolmentController = require('../db/controllers/DbEnrolmentController')
const dbStudentController = require('../db/controllers/DbStudentController')
const dbUnitController = require('../db/controllers/DbUnitController')
const unitContract = require('../blockchain/build/contracts/Unit.json')
const unitTrackerContract = require('../blockchain/build/contracts/Unit_Tracker.json')
const blockchain = require('../middleware/blockchain')
const utility = require('../utilities/Utility')
const Unit_Key = require('../object_models/blockchain/Unit_Key')

const getEnrolmentsByStudent = async (req, res, next)=>{
    let currentSemester
    await utility.getCurrentSemester().then(_currentSemester => {
        currentSemester = _currentSemester
    })

    await dbEnrolmentController.getEnrolmentsByStudent(req.params.studentId, currentSemester).then(async (enrolments) =>{
        let unitMap = new Map()
        let availableEnrolments = []
        let unavailableEnrolments = []

        for (const enrolment of enrolments){
            await dbUnitController.getUnit(enrolment.unitId).then(unit=>{
                unitMap[unit.unitId] = unit.unitName
            })

            let unitKey = new Unit_Key(req.params.studentId, enrolments.unitId, currentSemester)
            let serialisedKey = JSON.stringify(unitKey)
            await blockchain.checkExists(unitTrackerContract, process.env.UNIT_TRACKER_ADDRESS, serialisedKey).then(async (exists) => {

                if (!exists)
                {
                    availableEnrolments.push(enrolment)
                }
                else
                {
                    unavailableEnrolments.push(enrolment)
                }
            });
        }
        res.locals.unitMap = unitMap
        res.locals.availableEnrolments = availableEnrolments
        res.locals.unavailableEnrolments = unavailableEnrolments
    })
    
    next();
}

const getEnrolmentsByUnit = async (req, res, next)=>{

    let availableStudents = []
    let unavailableStudents = []
    let studentScoreMap = new Map()

    await utility.getCurrentSemester().then(async (_currentSemester) => {
        await dbEnrolmentController.getEnrolmentsByUnit(req.params.unitId, _currentSemester).then(async (enrolments) => {
            for (const enrolment of enrolments){
                let enrolKey = new Unit_Key(enrolment.studentId, enrolment.unitId, _currentSemester)
                let serialisedKey = JSON.stringify(enrolKey)
                await blockchain.checkExists(unitTrackerContract, process.env.UNIT_TRACKER_ADDRESS, serialisedKey).then(async (exists) => {
                    if (!exists)
                    {
                        await dbStudentController.getStudent(enrolment.studentId).then(student => {
                            availableStudents.push(student)
                        });
                    }
                    else
                    {
                        await dbStudentController.getStudent(enrolment.studentId).then(async (student) => {
                            unavailableStudents.push(student)  
                            await blockchain.getHashFromContract(unitContract, unitTrackerContract, process.env.UNIT_ADDRESS,
                                process.env.UNIT_TRACKER_ADDRESS, serialisedKey).then(async (hash) => {
                                    await ipfs.ipfsGetData(hash).then(data =>{
                                        let deserialisedUnit = JSON.parse(data)
                                        studentScoreMap[student.studentId] = deserialisedUnit._finalResult
                                    });
                                });
                        });
                    }
                });
            }
            res.locals.availableStudents = availableStudents;
            res.locals.unavailableStudents = unavailableStudents;
            res.locals.studentScoreMap = studentScoreMap;
        });
        
    });

    next();
}

module.exports = {
    getEnrolmentsByStudent,
    getEnrolmentsByUnit
}