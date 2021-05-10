const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, '../../.env'),
  debug: process.env.DEBUG
})

const fs = require('fs');
const Sequelize = require('sequelize');
const questionModel = require('./question')
const answerModel = require('./answer')
const degreeModel = require('./degree')
const enrolmentModel = require('./enrolment')
const moduleModel = require('./module')
const staffModel = require('./staff')
const studentModel = require('./student')
const unitModel = require('./unit')
const module_attempt = require('./module_attempt')
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

let sequelize;
// if (config.use_env_variable) {
//   sequelize = new Sequelize(process.env[config.use_env_variable], config);
// } else {
//   sequelize = new Sequelize(config.database, config.username, config.password, config);
// }
sequelize = new Sequelize(config.database, config.username, config.password, config);

const models = {
  Degree: degreeModel(sequelize, Sequelize.DataTypes),
  Staff: staffModel(sequelize, Sequelize.DataTypes),
  Student: studentModel(sequelize, Sequelize.DataTypes),
  Unit: unitModel(sequelize, Sequelize.DataTypes),
  Enrolment: enrolmentModel(sequelize, Sequelize.DataTypes),
  Module: moduleModel(sequelize, Sequelize.DataTypes),
  Question: questionModel(sequelize, Sequelize.DataTypes),
  Answer: answerModel(sequelize, Sequelize.DataTypes),
  Module_Attempt: module_attempt(sequelize, Sequelize.DataTypes)
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = {db, models};