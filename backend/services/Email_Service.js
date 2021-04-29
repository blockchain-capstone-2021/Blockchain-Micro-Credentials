require('dotenv').config({
    path: ('../.env'),
    debug: process.env.DEBUG
  })
const dbEnrolmentController = require('../db/controllers/DbEnrolmentController')
const dbStudentController = require('../db/controllers/DbStudentController')
const dbUnitController = require('../db/controllers/DbUnitController')
const dbDegreeController = require('../db/controllers/DbDegreeController')
const unitContract = require('../blockchain/build/contracts/Unit.json')
const unitTrackerContract = require('../blockchain/build/contracts/Unit_Tracker.json')
const blockchain = require('../middleware/blockchain')
const ipfs = require('../middleware/ipfs')
const Unit_Key = require('../object_models/blockchain/Unit_Key')

async function generateTranscript(_studentId){

    let enrolments = await dbEnrolmentController.getAllEnrolments(_studentId)
    let enrolmentMap = new Map()
    let transcript = []
    let completeUnits = []
    let incompleteUnits = []
    let existingEnrolment
    let currentEnrolmentPeriod

    for(const enrolment of enrolments){
        if(enrolmentMap.has(enrolment.unitId)){
            existingEnrolment = enrolmentMap.get(enrolment.unitId)
            currentEnrolmentPeriod = enrolment.semOfEnrolment
            existingEnrolmentPeriod = existingEnrolment.semOfEnrolment
            if(currentEnrolmentPeriod.localeCompare(existingEnrolment) < 0)
            {
                enrolmentMap.set(enrolment.unitId, enrolment)
            }
        }
        else{
            enrolmentMap.set(enrolment.unitId, enrolment)
        }
    }

    for(const [key, value] of enrolmentMap.entries()){

        let unit = await dbUnitController.getUnit(key)

        let semester = `Semester ${value.semOfEnrolment.substr(6, value.semOfEnrolment.length-1)} ${value.semOfEnrolment.substr(1, 4)}`
        let course = key
        let courseName = unit.unitName
        let unitValue = unit.unitCreditPoints
        let grade

        let unitKey = new Unit_Key(value.studentId, value.unitId, value.semOfEnrolment)
        let serialisedUnitKey = JSON.stringify(unitKey)

        let exists = await blockchain.checkExists(unitTrackerContract, process.env.UNIT_TRACKER_ADDRESS, serialisedUnitKey)

        if(exists)
        {
            let hash = await blockchain.getHashFromContract(unitContract, unitTrackerContract, process.env.UNIT_ADDRESS,
                process.env.UNIT_TRACKER_ADDRESS, serialisedUnitKey)
            let unitData = await ipfs.ipfsGetData(hash)
            let deserialisedUnit = JSON.parse(unitData)
            let result = deserialisedUnit._finalResult
    
            if(result >= 80){ 
                grade = "HD"
            }else if (result >= 70 && result < 80){ 
                grade = "DI"
            }else if(result >= 60 && result < 70){ 
                grade = "CR"
            }else if(result >= 50 && result < 60){ 
                grade = "PA"
            }else{ 
                grade = "NN"
            }

            completeUnits.push({semester, course, courseName, grade, unitValue})
        }
        else{
            grade = ""
            incompleteUnits.push({semester, course, courseName, grade, unitValue})
        }
    }
    transcript = completeUnits.concat(incompleteUnits)
    transcript.sort(compare)
    transcript.reverse()
    return transcript
}

function compare( currentRow, nextRow ) {
    currentRowSem = currentRow.semester.charAt(9)
    currentRowYear = currentRow.semester.substr(11, currentRow.semester.length-1)
    currentRowDate = currentRowYear+currentRowSem

    nextRowSem = nextRow.semester.charAt(9)
    nextRowYear = nextRow.semester.substr(11, nextRow.semester.length-1)
    nextRowDate = nextRowYear+nextRowSem

    if ( currentRowDate < nextRowDate ){
      return -1;
    }
    if ( currentRowDate > nextRowDate ){
      return 1;
    }
    return 0;
}