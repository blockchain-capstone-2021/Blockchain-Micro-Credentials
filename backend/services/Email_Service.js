require('dotenv').config({
    path: ('../.env'),
    debug: process.env.DEBUG
  })

let ejs = require("ejs");
let pdf = require("html-pdf");
const fs = require("fs");
const AWS = require('aws-sdk');
const Promise = require('bluebird');
const path = require('path');

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
  let fileContent = fs.readFileSync("../templates/transcript-template.ejs")
  let data =  ejs.render(fileContent.toString(), { student: _student, degree: _degree, transcript: transcriptRows })
  let options = {
    "fomart": "A4",
    // "filename": `../attachments/${_studentId}_Transcript.pdf`,
    "orientation": "Landscape",
    "header": {
      "height": "28mm"
    },
    "footer": {
      "height": "28mm",
    },
  };

  let createResult = pdf.create(data, options);
  let pdfToFile = Promise.promisify(createResult.__proto__.toFile, { context: createResult });

  let bufferResult = await pdfToFile()

  if(!bufferResult.filename || bufferResult.filename.length === 0)
  {
    success = false;
  }
  else
  {
    success = true;
  }

  return success 
}

async function generateDegree(_studentId, _degreeId, _student, _degree)
{
  let success
  let fileContent = fs.readFileSync("../templates/degree-template.ejs")
  let data =  ejs.render(fileContent.toString(), { student: _student, degree: _degree })
  let options = {
    "fomart": "A4",
    "filename": `../attachments/${_studentId}_${_degreeId}.pdf`,
    "orientation": "Landscape",
    "header": {
      "height": "28mm"
    },
    "footer": {
      "height": "28mm",
    },
  };

  let createResult = pdf.create(data, options);
  let pdfToFile = Promise.promisify(createResult.__proto__.toFile, { context: createResult });

  let bufferResult = await pdfToFile()

  if(!bufferResult.filename || bufferResult.filename.length === 0)
  {
    success = false;
  }
  else
  {
    success = true;
  }

  return success 
}

async function generateCertificate(_studentId, _unitId, _student, _unit)
{
  let success = false
  let fileContent = fs.readFileSync("../templates/certificate-template.ejs")
  let data =  ejs.render(fileContent.toString(), { student: _student, unit: _unit })
  let options = {
    "fomart": "A4",
    "filename": `../attachments/${_studentId}_${_unitId}.pdf`,
    "orientation": "Landscape",
    "header": {
      "height": "28mm"
    },
    "footer": {
      "height": "28mm",
    },
  };

  let createResult = pdf.create(data, options);
  let pdfToFile = Promise.promisify(createResult.__proto__.toFile, { context: createResult });

  let bufferResult = await pdfToFile()

  if(!bufferResult.filename || bufferResult.filename.length === 0)
  {
    success = false;
  }
  else
  {
    success = true;
  }

  return success 
}

async function uploadToS3(_bucket, filePath)
{
  let params = {
    Bucket: _bucket,
    Body : fs.createReadStream(filePath),
    Key : path.basename(filePath)
  };

  let s3Upload = Promise.promisify(s3.upload, {context: s3});
  let uploadResult = await s3Upload(params)

  if(!uploadResult.Location || uploadResult.Location.length === 0)
  {
    throw Error(uploadResult.err)
  }
}

async function sendEmail(_studentEmail, _subject, _text, _attachments, _html)
{
  const msg = {
    to: _studentEmail, // Change to your recipient
    from: { email: process.env.SENDGRID_FROM_EMAIL, // Change to your verified sender
            name: "notification@rmit.edu.au (No-Reply)" },
    subject: _subject,
    text: _text,
    attachments: _attachments,
    html: _html
  }

  let response = await sgMail.send(msg).catch((error) => {
    throw Error(error)
  })
}

async function sendDegreeEmail(_studentId, _unitId)
{
    let student = await dbStudentController.getStudent(_studentId)
    let degree = await dbDegreeController.getDegree(student.degreeId)
    let unit = await dbUnitController.getUnit(_unitId) 

    let transcriptRows = await generateTranscriptRows(_studentId)
    
    let transcriptSuccess = await generateTranscript(_studentId, transcriptRows, student, degree)
    let certificateSuccess = await generateCertificate(_studentId, _unitId, student, unit)
    let degreeSuccess = await generateDegree(_studentId, student.degreeId, student, degree)
    
    let transcriptPath = `../attachments/${_studentId}_Transcript.pdf`
    let certificatePath = `../attachments/${_studentId}_${unit.unitId}.pdf`
    let degreePath = `../attachments/${_studentId}_${student.degreeId}.pdf`

    if(transcriptSuccess && certificateSuccess && degreeSuccess)
    {
      await uploadToS3(transcriptBucket, transcriptPath)
      await uploadToS3(certificateBucket, certificatePath)
      await uploadToS3(degreeBucket, degreePath)
    }
    else
    {
      throw Error("Email Service Error") 
    }

    let transcript = fs.readFileSync(transcriptPath).toString("base64");
    let degreePdf = fs.readFileSync(degreePath).toString("base64");
    let certificate = fs.readFileSync(certificatePath).toString("base64");

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
    Your Micro-Credential Certificate for: ${_unitId} - ${unit.unitName} Last but not the least, your ${degree.degreeName} Degree 
    We hope you had a wonderful time at the Royal Melbourne Institute of Technology, and we would like to wish you luck for your future endeavours. Sincerely, The RMIT Team.`

    let html = `Dear <strong>${student.studentName}</strong>, <br><br> on behalf of the entire RMIT team, we congratulate you on completing the <strong>${degree.degreeName}</strong>. 
    <br><br>Please find attached the following: <ul><li><strong>Your Degree Transcript</strong></li><li><strong>Your Micro-Credential Certificate for: ${_unitId} - ${unit.unitName}</strong></li>
    <li>Last but not the least, <strong>your ${degree.degreeName} Degree</strong></li></ul> We hope you had a wonderful time at the Royal Melbourne Institute of Technology, and
    we would like to wish you luck for your future endeavours. <br><br><strong>Sincerely, <br>The RMIT Team.</strong>`
    
    await sendEmail(student.studentEmail, subject, text, attachments, html)

    await deleteFiles([transcriptPath, certificatePath, degreePath])
}

async function sendYearEmail(_studentId, _unitId)
{
    let student = await dbStudentController.getStudent(_studentId)
    let degree = await dbDegreeController.getDegree(student.degreeId)
    let unit = await dbUnitController.getUnit(_unitId) 
    let year = (student.studentCreditPoints / degree.creditPointsPerSem)/2

    let transcriptRows = await generateTranscriptRows(_studentId)
    
    let transcriptSuccess = await generateTranscript(_studentId, transcriptRows, student, degree)
    let certificateSuccess = await generateCertificate(_studentId, _unitId, student, unit)
    
    let transcriptPath = `../attachments/${_studentId}_Transcript.pdf`
    let certificatePath = `../attachments/${_studentId}_${unit.unitId}.pdf`

    if(transcriptSuccess && certificateSuccess)
    {
      await uploadToS3(transcriptBucket, transcriptPath)
      await uploadToS3(certificateBucket, certificatePath)
    }
    else
    {
      throw Error("Email Service Error")  
    }

    let transcript = fs.readFileSync(transcriptPath).toString("base64");
    let certificate = fs.readFileSync(certificatePath).toString("base64");

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
    Your Micro-Credential Certificate for: ${_unitId} - ${unit.unitName}
    Sincerely, The RMIT Team.`

    let html = `Dear <strong>${student.studentName}</strong>, <br><br> on behalf of the entire RMIT team, congratulations on completing Year ${year} of the <strong>${degree.degreeName}</strong>. 
    <br><br>Please find attached the following: <ul><li><strong>Your Updated Transcript</strong></li><li><strong>Your Micro-Credential Certificate for: ${_unitId} - ${unit.unitName}</strong></li></ul> 
    <br><strong>Sincerely, <br>The RMIT Team.</strong>`

    await sendEmail(student.studentEmail, subject, text, attachments, html)

    await deleteFiles([transcriptPath, certificatePath])
}

async function sendSemesterEmail(_studentId, _unitId)
{
    let student = await dbStudentController.getStudent(_studentId)
    let degree = await dbDegreeController.getDegree(student.degreeId)
    let unit = await dbUnitController.getUnit(_unitId) 
    let year = ((student.studentCreditPoints - degree.creditPointsPerSem) / degree.creditPointsPerSem)/2

    let transcriptRows = await generateTranscriptRows(_studentId)
    
    let transcriptSuccess = await generateTranscript(_studentId, transcriptRows, student, degree)
    let certificateSuccess = await generateCertificate(_studentId, _unitId, student, unit)
    
    let transcriptPath = `../attachments/${_studentId}_Transcript.pdf`
    let certificatePath = `../attachments/${_studentId}_${unit.unitId}.pdf`

    if(transcriptSuccess && certificateSuccess)
    {
      await uploadToS3(transcriptBucket, transcriptPath)
      await uploadToS3(certificateBucket, certificatePath)
    }
    else
    {
      throw Error("Email Service Error")  
    }

    let transcript = fs.readFileSync(transcriptPath).toString("base64");
    let certificate = fs.readFileSync(certificatePath).toString("base64");

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
    Your Micro-Credential Certificate for: ${_unitId} - ${unit.unitName} 
    Sincerely, The RMIT Team.`

    let html = `Dear <strong>${student.studentName}</strong>, <br><br> on behalf of the entire RMIT team, congratulations on completing Semeseter 1 of Year ${year} of the <strong>${degree.degreeName}</strong>. 
    <br><br>Please find attached the following: <ul><li><strong>Your Updated Transcript</strong></li><li><strong>Your Micro-Credential Certificate for: ${_unitId} - ${unit.unitName}</strong></li></ul> 
    <br><strong>Sincerely, <br>The RMIT Team.</strong>`

    await sendEmail(student.studentEmail, subject, text, attachments, html)

    await deleteFiles([transcriptPath, certificatePath])
}

async function sendUnitEmail(_studentId, _unitId)
{
    let student = await dbStudentController.getStudent(_studentId)
    let degree = await dbDegreeController.getDegree(student.degreeId)
    let unit = await dbUnitController.getUnit(_unitId) 

    let transcriptRows = await generateTranscriptRows(_studentId)
    
    let transcriptSuccess = await generateTranscript(_studentId, transcriptRows, student, degree)
    let certificateSuccess = await generateCertificate(_studentId, _unitId, student, unit)
    
    let transcriptPath = `../attachments/${_studentId}_Transcript.pdf`
    let certificatePath = `../attachments/${_studentId}_${unit.unitId}.pdf`

    if(transcriptSuccess && certificateSuccess)
    {
      await uploadToS3(transcriptBucket, transcriptPath)
      await uploadToS3(certificateBucket, certificatePath)
    }
    else
    {
      throw Error("Email Service Error")  
    }

    let transcript = fs.readFileSync(transcriptPath).toString("base64");
    let certificate = fs.readFileSync(certificatePath).toString("base64");

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
    let text = `Dear ${student.studentName}, on behalf of the entire RMIT team, we congratulate you on completing ${_unitId} - ${unit.unitName}. Please find attached the following: Your Updated Transcript 
    Your Micro-Credential Certificate for: ${_unitId} - ${unit.unitName}
    Sincerely, The RMIT Team.`

    let html = `Dear <strong>${student.studentName}</strong>, <br><br> on behalf of the entire RMIT team, we congratulate you on completing <strong>${_unitId} - ${unit.unitName}</strong>. 
    <br><br>Please find attached the following: <ul><li><strong>Your Updated Transcript</strong></li><li><strong>Your Micro-Credential Certificate for: ${_unitId} - ${unit.unitName}</strong></li></ul> 
    <br><strong>Sincerely, <br>The RMIT Team.</strong>`
    
    await sendEmail(student.studentEmail, subject, text, attachments, html)

    await deleteFiles([transcriptPath, certificatePath])
}

async function sendFailEmail(_studentId, _unitId){
    let student = await dbStudentController.getStudent(_studentId)
    let degree = await dbDegreeController.getDegree(student.degreeId)
    let unit = await dbUnitController.getUnit(_unitId) 

    let transcriptRows = await generateTranscriptRows(_studentId)
    
    let transcriptSuccess = await generateTranscript(_studentId, transcriptRows, student, degree)
    
    let transcriptPath = `../attachments/${_studentId}_Transcript.pdf`

    if(transcriptSuccess)
    {
      await uploadToS3(transcriptBucket, transcriptPath)
    }
    else
    {
      throw Error("Email Service Error")  
    }

    let transcript = fs.readFileSync(transcriptPath).toString("base64");

    let attachments = [
      {
        content: transcript,
        filename: `${_studentId}_Transcript.pdf`,
        type: "application/pdf",
        disposition: "attachment"
      }
    ]

    let subject = 'Micro-Credential Unsuccessful'
    let text = `Dear ${student.studentName}, we regret to inform you that you have not completed ${_unitId} - ${unit.unitName}. Please find attached the following: Your Updated Transcript 
    Sincerely, The RMIT Team.`

    let html = `Dear <strong>${student.studentName}</strong>, <br><br> we regret to inform you that you have not completed <strong>${_unitId} - ${unit.unitName}</strong>. 
    <br><br>Please find attached the following: <ul><li><strong>Your Updated Transcript</strong></li></ul>
    <br><strong>Sincerely, <br>The RMIT Team.</strong>`
      
    await sendEmail(student.studentEmail, subject, text, attachments, html)

    await deleteFiles([transcriptPath])
}

async function deleteFiles(filePaths)
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