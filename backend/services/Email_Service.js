require('dotenv').config({
    path: ('../.env'),
    debug: process.env.DEBUG
  })

let ejs = require("ejs");
let pdf = require("html-pdf");
const fs = require("fs");
const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  });

var s3 = new AWS.S3();

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const dbEnrolmentController = require('../db/controllers/DbEnrolmentController')
const dbStudentController = require('../db/controllers/DbStudentController')
const dbUnitController = require('../db/controllers/DbUnitController')
const dbDegreeController = require('../db/controllers/DbDegreeController')
const unitContract = require('../blockchain/build/contracts/Unit.json')
const unitTrackerContract = require('../blockchain/build/contracts/Unit_Tracker.json')
const blockchain = require('../middleware/blockchain')
const ipfs = require('../middleware/ipfs')
const Unit_Key = require('../object_models/blockchain/Unit_Key')

const transcriptBucket =  'capstone-transcript-bucket'
const certificateBucket = 'capstone-certificate-bucket'
const degreeBucket = 'capstone-degree-bucket'

async function generateTranscriptRows(_studentId){

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
    let currentRowData = currentRow.semester.split(" ")
    currentRowDate = currentRowData[2]+currentRowData[1]

    let nextRowData = nextRow.semester.split(" ")
    nextRowDate = nextRowData[2]+nextRowData[1]

    if ( currentRowDate < nextRowDate ){
      return -1;
    }
    if ( currentRowDate > nextRowDate ){
      return 1;
    }
    return 0;
}

async function generateTranscript(_studentId, transcriptRows, _student, _degree)
{
  let success = false
  let path = "../templates/transcript-template.ejs"
  ejs.renderFile(path, { students: students }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let options = {
        "fomart": "A4",
        "orientation": "Portrait",
        "header": {
          "height": "28mm"
        },
        "footer": {
          "height": "28mm",
        },
      };
      pdf.create(data, options).toFile(`../attachments/${_studentId}_Transcript.pdf`, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
          success = true
        }
      });
    }
  });
  return success 
}

async function generateDegree(_studentId, _degreeId, _student, _degree)
{
  let success = false
  let path = "./degree-template.ejs"
  ejs.renderFile(path, { students: students }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let options = {
        "fomart": "A4",
        "orientation": "Landscape",
        "header": {
          "height": "28mm"
        },
        "footer": {
          "height": "28mm",
        },
      };
      pdf.create(data, options).toFile(`../attachments/${_studentId}_${_degreeId}.pdf`, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
          success = true
        }
      });
    }
  });
  return success 
}

async function generateCertificate(_studentId, _unitId, _student, _unit)
{
  let success = false
  let path = "./certificate-template.ejs"
  ejs.renderFile(path, { students: students }, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let options = {
        "fomart": "A4",
        "orientation": "Landscape",
        "header": {
          "height": "28mm"
        },
        "footer": {
          "height": "28mm",
        },
      };
      pdf.create(data, options).toFile(`../attachments/${_studentId}_${_unitId}.pdf`, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
          success = true
        }
      });
    }
  });
  return success 
}

async function uploadToS3(_bucket, _body, _key)
{
  let success = false
  let params = {
    Bucket: _bucket,
    Body : _body,
    Key : _key
  };

  s3.upload(params, function (err, data) {
    //handle error
    if (err) {
      console.log("Error", err);
    }

    //success
    if (data) {
      console.log("Uploaded in:", data.Location);
      success = true;
    }
  });

  return success
}

async function sendEmail(_studentEmail, _subject, _text, _attachments, _html)
{
  let success = false

  const msg = {
    to: _studentEmail, // Change to your recipient
    from: process.env.SENDGRID_FROM_EMAIL, // Change to your verified sender
    fromname: "notification@rmit.edu.au (No-Reply)",
    subject: _subject,
    text: _text,
    attachments: _attachments,
    html: _html
  }

  sgMail.send(msg).then((response) => {
      console.log(response[0].statusCode)
      console.log(response[0].headers)
      success = true
  })
  .catch((error) => {
    console.error(error)
  })

  return success
}

async function sendDegreeEmail(_studentId, _unitId)
{
    let student = await dbStudentController.getStudent(_studentId)
    let degree = await dbDegreeController.getDegree(student.degreeId)
    let unit = await dbUnitController.getUnit(_unitId) 

    let transcript = fs.readFileSync(`../attachments/${_studentId}_Transcript.pdf`).toString("base64");
    let degreePdf = fs.readFileSync(`../attachments/${_studentId}_${student.degreeId}.pdf`).toString("base64");
    let certificate = fs.readFileSync(`../attachments/${_studentId}_${unit.unitId}.pdf`).toString("base64");

    let attachments = [
      {
        content: transcript,
        filename: `${_studentId}_Transcript.pdf`,
        type: "application/pdf",
        disposition: "attachment"
      },
      {
        content: certificate,
        filename: `${_studentId}_${unit.unitId}_Certificate.pdf`,
        type: "application/pdf",
        disposition: "attachment"
      },
      {
        content: degreePdf,
        filename: `${_studentId}_${degree.degreeName}.pdf`,
        type: "application/pdf",
        disposition: "attachment"
      }
    ];

    let subject = 'CONGRATULATIONS - Your Degree is Complete'
    let text = `Dear ${student.studentName}, on behalf of the entire RMIT team, we congratulate you on completing the ${degree.degreeName}. Please find attached the following: Your Degree Transcript 
    Your Micro-Credential Certificate for: ${_unitId - unit.unitName} Last but not the least, your ${degree.degreeName} Degree 
    We hope you had a wonderful time at the Royal Melbourne Institute of Technology, and we would like to wish you luck for your future endeavours. Sincerely, The RMIT Team.`

    let html = `Dear <strong>${student.studentName}</strong>, <br><br> on behalf of the entire RMIT team, we congratulate you on completing the <strong>${degree.degreeName}</strong>. 
    <br><br>Please find attached the following: <ul><li><strong>Your Degree Transcript</strong></li><li><strong>Your Micro-Credential Certificate for: ${_unitId - unit.unitName}</strong></li>
    <li>Last but not the least, <strong>your ${degree.degreeName} Degree</strong</li></ul> We hope you had a wonderful time at the Royal Melbourne Institute of Technology, and
    we would like to wish you luck for your future endeavours. <br><br><strong>Sincerely, <br>The RMIT Team.</strong>`
    
    let success = await sendEmail(student.studentEmail, subject, text, attachments, html)
}

async function sendYearEmail(_studentId, _unitId)
{
    let student = await dbStudentController.getStudent(_studentId)
    let degree = await dbDegreeController.getDegree(student.degreeId)
    let unit = await dbUnitController.getUnit(_unitId) 
    let year = (student.studentCreditPoints / degree.creditPointsPerSem)/2

    let transcript = fs.readFileSync(`../attachments/${_studentId}_Transcript.pdf`).toString("base64");
    let certificate = fs.readFileSync(`../attachments/${_studentId}_${unit.unitId}.pdf`).toString("base64");

    let attachments = [
      {
        content: transcript,
        filename: `${_studentId}_Transcript.pdf`,
        type: "application/pdf",
        disposition: "attachment"
      },
      {
        content: certificate,
        filename: `${_studentId}_${unit.unitId}_Certificate.pdf`,
        type: "application/pdf",
        disposition: "attachment"
      }
    ]

    let subject = `CONGRATULATIONS - Year ${year} is Complete`
    let text = `Dear ${student.studentName}, on behalf of the entire RMIT team, congratulations on completing Year ${year} of the ${degree.degreeName}. Please find attached the following: Your Updated Transcript 
    Your Micro-Credential Certificate for: ${_unitId - unit.unitName} 
    Sincerely, The RMIT Team.`

    let html = `Dear <strong>${student.studentName}</strong>, <br><br> on behalf of the entire RMIT team, congratulations on completing Year ${year} of the <strong>${degree.degreeName}</strong>. 
    <br><br>Please find attached the following: <ul><li><strong>Your Updated Transcript</strong></li><li><strong>Your Micro-Credential Certificate for: ${_unitId - unit.unitName}</strong></li></ul> 
    <br><strong>Sincerely, <br>The RMIT Team.</strong>`

    let success = await sendEmail(student.studentEmail, subject, text, attachments, html)
}

async function sendSemesterEmail(_studentId, _unitId)
{
    let student = await dbStudentController.getStudent(_studentId)
    let degree = await dbDegreeController.getDegree(student.degreeId)
    let unit = await dbUnitController.getUnit(_unitId) 
    let year = ((student.studentCreditPoints - degree.creditPointsPerSem) / degree.creditPointsPerSem)/2

    let transcript = fs.readFileSync(`../attachments/${_studentId}_Transcript.pdf`).toString("base64");
    let certificate = fs.readFileSync(`../attachments/${_studentId}_${unit.unitId}.pdf`).toString("base64");

    let attachments = [
      {
        content: transcript,
        filename: `${_studentId}_Transcript.pdf`,
        type: "application/pdf",
        disposition: "attachment"
      },
      {
        content: certificate,
        filename: `${_studentId}_${unit.unitId}_Certificate.pdf`,
        type: "application/pdf",
        disposition: "attachment"
      }
    ]

    let subject = `CONGRATULATIONS - Semeseter 1 of ${year} is Complete`
    let text = `Dear ${student.studentName}, on behalf of the entire RMIT team, congratulations on completing Semeseter 1 of Year ${year} of the ${degree.degreeName}. Please find attached the following: Your Updated Transcript 
    Your Micro-Credential Certificate for: ${_unitId - unit.unitName} 
    Sincerely, The RMIT Team.`

    let html = `Dear <strong>${student.studentName}</strong>, <br><br> on behalf of the entire RMIT team, congratulations on completing Semeseter 1 of Year ${year} of the <strong>${degree.degreeName}</strong>. 
    <br><br>Please find attached the following: <ul><li><strong>Your Updated Transcript</strong></li><li><strong>Your Micro-Credential Certificate for: ${_unitId - unit.unitName}</strong></li></ul> 
    <br><strong>Sincerely, <br>The RMIT Team.</strong>`

    let success = await sendEmail(student.studentEmail, subject, text, attachments, html)
}

async function sendUnitEmail(_studentId, _unitId)
{
    let student = await dbStudentController.getStudent(_studentId)
    let degree = await dbDegreeController.getDegree(student.degreeId)
    let unit = await dbUnitController.getUnit(_unitId) 

    let transcript = fs.readFileSync(`../attachments/${_studentId}_Transcript.pdf`).toString("base64");
    let certificate = fs.readFileSync(`../attachments/${_studentId}_${unit.unitId}.pdf`).toString("base64");

    let attachments = [
      {
        content: transcript,
        filename: `${_studentId}_Transcript.pdf`,
        type: "application/pdf",
        disposition: "attachment"
      },
      {
        content: certificate,
        filename: `${_studentId}_${unit.unitId}_Certificate.pdf`,
        type: "application/pdf",
        disposition: "attachment"
      }
    ]

    let subject = 'CONGRATULATIONS - Your Micro-Credential is Complete'
    let text = `Dear ${student.studentName}, on behalf of the entire RMIT team, we congratulate you on completing ${unit.unitId} - ${unit.unitName}. Please find attached the following: Your Updated Transcript 
    Your Micro-Credential Certificate for: ${_unitId - unit.unitName}
    Sincerely, The RMIT Team.`

    let html = `Dear <strong>${student.studentName}</strong>, <br><br> on behalf of the entire RMIT team, we congratulate you on completing <strong>${unit.unitId} - ${unit.unitName}</strong>. 
    <br><br>Please find attached the following: <ul><li><strong>Your Updated Transcript</strong></li><li><strong>Your Micro-Credential Certificate for: ${_unitId - unit.unitName}</strong></li></ul> 
    <br><strong>Sincerely, <br>The RMIT Team.</strong>`
    
    let success = await sendEmail(student.studentEmail, subject, text, attachments, html)
}

async function sendFailEmail(_studentId, _unitId){
    let student = await dbStudentController.getStudent(_studentId)
    let degree = await dbDegreeController.getDegree(student.degreeId)
    let unit = await dbUnitController.getUnit(_unitId) 

    let transcript = fs.readFileSync(`../attachments/${_studentId}_Transcript.pdf`).toString("base64");

    let attachments = [
      {
        content: transcript,
        filename: `${_studentId}_Transcript.pdf`,
        type: "application/pdf",
        disposition: "attachment"
      }
    ]

    let subject = 'Micro-Credential Unsuccessfull'
    let text = `Dear ${student.studentName}, we regret to inform you that you have not completed ${unit.unitId} - ${unit.unitName}. Please find attached the following: Your Updated Transcript 
    Sincerely, The RMIT Team.`

    let html = `Dear <strong>${student.studentName}</strong>, <br><br> we regret to inform you that you have not completed <strong>${unit.unitId} - ${unit.unitName}</strong>. . 
    <br><br>Please find attached the following: <ul><li><strong>Your Updated Transcript</strong></li></ul>
    <br><strong>Sincerely, <br>The RMIT Team.</strong>`
      
    let success = await sendEmail(student.studentEmail, subject, text, attachments, html)
}

async function deleteFile(filePaths)
{
  for(const path of filePaths)
  {
    fs.unlinkSync(path)
  }
}

module.exports = {
    sendDegreeEmail,
    sendYearEmail,
    sendSemesterEmail,
    sendUnitEmail, 
    sendFailEmail
}