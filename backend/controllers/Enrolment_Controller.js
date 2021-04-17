require('dotenv').config({
  path: ('../.env_address'),
  debug: process.env.DEBUG
})
const dbEnrolmentController = require('../db/controllers/DbEnrolmentController')
const dbStudentController = require('../db/controllers/DbStudentController')
const dbUnitController = require('../db/controllers/DbUnitController')
const unitContract = require('../blockchain/build/contracts/Unit.json')
const unitTrackerContract = require('../blockchain/build/contracts/Unit_Tracker.json')
const blockchain = require('../middleware/blockchain')
const Unit_Key = require('../object_models/blockchain/Unit_Key')

const getEnrolmentsByStudent = async (req, res, next)=>{
    
    
    next();
}

const getEnrolmentsByUnit = async (req, res, next)=>{

    
    next();
}

module.exports = {
    getEnrolmentsByStudent,
    getEnrolmentsByUnit
}