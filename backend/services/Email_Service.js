let ejs = require("ejs");
let pdf = require("html-pdf");
const fs = require("fs");
const AWS = require('aws-sdk');
const Promise = require('bluebird');
const path = require('path');

require('dotenv').config({
    path: path.join(__dirname, '../.env'),
    debug: process.env.DEBUG
});

//Set up AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
});

var s3 = new AWS.S3();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const dbEnrolmentController = require('../db/controllers/DbEnrolmentController');
const dbStudentController = require('../db/controllers/DbStudentController');
const dbUnitController = require('../db/controllers/DbUnitController');
const dbDegreeController = require('../db/controllers/DbDegreeController');
const unitContract = require('../blockchain/build/contracts/Unit.json');
const unitTrackerContract = require('../blockchain/build/contracts/Unit_Tracker.json');
const blockchain = require('../middleware/blockchain');
const ipfs = require('../middleware/ipfs');
const Unit_Key = require('../object_models/blockchain/Unit_Key');

const transcriptBucket = 'capstone-transcript-bucket';
const certificateBucket = 'capstone-certificate-bucket';
const degreeBucket = 'capstone-degree-bucket';

const degreeAttachmentOption = 0;
const transcriptAttachmentOption = 1;
const certificateAttachmentOption = 2;

//Method to generate the transcript rows
async function generateTranscriptRows(studentId) {

    let enrolments = await dbEnrolmentController.getAllEnrolments(studentId);
    let enrolmentMap = new Map();
    let transcript = [];
    let completeUnits = [];
    let incompleteUnits = [];
    let existingEnrolment;
    let currentEnrolmentPeriod;

    //Get all the latest enrolments of the student
    for (const enrolment of enrolments) {
        if (enrolmentMap.has(enrolment.unitId)) {
            existingEnrolment = enrolmentMap.get(enrolment.unitId);
            currentEnrolmentPeriod = enrolment.semOfEnrolment;
            existingEnrolmentPeriod = existingEnrolment.semOfEnrolment;
            if (currentEnrolmentPeriod.localeCompare(existingEnrolment) < 0) {
                enrolmentMap.set(enrolment.unitId, enrolment);
            }
        }
        else {
            enrolmentMap.set(enrolment.unitId, enrolment);
        }
    }

    //Create a transcript row for each enrolment
    for (const [key, value] of enrolmentMap.entries()) {

        let unit = await dbUnitController.getUnit(key);

        let semester = `Semester ${value.semOfEnrolment.substr(6, value.semOfEnrolment.length - 1)} ${value.semOfEnrolment.substr(1, 4)}`;
        let course = key;
        let courseName = unit.unitName;
        let unitValue = unit.unitCreditPoints;
        let grade;

        let unitKey = new Unit_Key(value.studentId, value.unitId, value.semOfEnrolment);
        let serialisedUnitKey = JSON.stringify(unitKey);

        let exists = await blockchain.checkExists(unitTrackerContract, process.env.UNIT_TRACKER_ADDRESS, serialisedUnitKey);

        //Check whether the unit has been completed
        if (exists) {
            let hash = await blockchain.getHashFromContract(unitContract, unitTrackerContract, process.env.UNIT_ADDRESS,
                process.env.UNIT_TRACKER_ADDRESS, serialisedUnitKey);
            let unitData = await ipfs.ipfsGetData(hash);
            let deserialisedUnit = JSON.parse(unitData);
            let result = deserialisedUnit._finalResult;

            //Calculate the grade achieved
            if (result >= 80) {
                grade = "HD";
            } else if (result >= 70 && result < 80) {
                grade = "DI";
            } else if (result >= 60 && result < 70) {
                grade = "CR";
            } else if (result >= 50 && result < 60) {
                grade = "PA";
            } else {
                grade = "NN";
            }

            completeUnits.push({ semester, course, courseName, grade, unitValue });
        }
        else {
            grade = "";
            incompleteUnits.push({ semester, course, courseName, grade, unitValue });
        }
    }
    //Transcript rows is the combination of complete and incomplete units
    transcript = completeUnits.concat(incompleteUnits);
    //Order the rows in ascending order of enrolment period 
    transcript.sort(compare);
    //Reverse the array to be sorted in ascending order
    transcript.reverse();
    return transcript;
}

//Comparator to sort the arrary of transcripts in ascending order 
function compare(currentRow, nextRow) {
    let currentRowData = currentRow.semester.split(" ");
    currentRowDate = currentRowData[2] + currentRowData[1];

    let nextRowData = nextRow.semester.split(" ");
    nextRowDate = nextRowData[2] + nextRowData[1];

    if (currentRowDate < nextRowDate) {
        return -1;
    }
    if (currentRowDate > nextRowDate) {
        return 1;
    }
    return 0;
}

//Function to generate attachment of given type
async function generateAttachment(studentId, degreeId, unitId, transcriptRows, student, degree, unit, attachmentOption) {
    let success;
    let fileContent;
    let fileName;
    let data;
    let orientation = "Landscape";

    //Check what the attachment should be.
    if (attachmentOption === degreeAttachmentOption) {
        //template file
        fileContent = fs.readFileSync(path.join(__dirname, "../templates/degree-template.ejs"));
        //render the template file with the given attributes
        data = ejs.render(fileContent.toString(), { student: student, degree: degree });
        //Provide the filename for the pdf to bre created
        fileName = `../attachments/${studentId}_${degreeId}.pdf`;
    } else if (attachmentOption === transcriptAttachmentOption) {
        //template file
        fileContent = fs.readFileSync(path.join(__dirname, '../templates/transcript-template.ejs'));
        //render the template file with the given attributes
        data = ejs.render(fileContent.toString(), { student: student, degree: degree, transcript: transcriptRows });
        //Provide the filename for the pdf to bre created
        fileName = `../attachments/${studentId}_Transcript.pdf`;
        orientation = "Portrait";
    } else if (attachmentOption === certificateAttachmentOption) {
        //template file
        fileContent = fs.readFileSync(path.join(__dirname, "../templates/certificate-template.ejs"));
        //render the template file with the given attributes
        data = ejs.render(fileContent.toString(), { student: student, unit: unit });
        //Provide the filename for the pdf to bre created
        fileName = `../attachments/${studentId}_${unitId}.pdf`;
    }

    //Give the attachment design configuration 
    let options = {
        "fomart": "A4",
        "filename": fileName,
        "orientation": orientation,
        "header": {
            "height": "28mm"
        },
        "footer": {
            "height": "28mm",
        },
    };

    //Converting async create function to synchronous
    let createResult = pdf.create(data, options);
    let pdfToFile = Promise.promisify(createResult.__proto__.toFile, { context: createResult });

    //Wait till the pdf file is created
    let bufferResult = await pdfToFile();

    //Check whether the file was successfully created
    if (!bufferResult.filename || bufferResult.filename.length === 0) {
        success = false;
    }
    else {
        success = true;
    }

    return success;
}

//Function to upload the generated pdfs to a s3 bucket
async function uploadToS3(bucket, filePath) {
    let params = {
        Bucket: bucket,
        Body: fs.createReadStream(filePath),
        Key: path.basename(filePath)
    };

    //Converting async upload function to synchronous
    let s3Upload = Promise.promisify(s3.upload, { context: s3 });
    let uploadResult = await s3Upload(params);

    //Throw an error if the upload errored out 
    if (!uploadResult.Location || uploadResult.Location.length === 0) {
        throw Error(uploadResult.err);
    }
}

//Method to send the email to the provided email address with the given configuration
async function sendEmail(studentEmail, subject, text, attachments, html) {
    const msg = {
        to: studentEmail,
        from: {
            email: process.env.SENDGRID_FROM_EMAIL,
            name: "notification@rmit.edu.au (No-Reply)"
        },
        subject: subject,
        text: text,
        attachments: attachments,
        html: html
    };

    //Throw an error if sending the email caused an error
    let response = await sgMail.send(msg).catch((error) => {
        throw Error(error);
    });
}

//Function called to send an email when a degree is complete
async function sendDegreeEmail(studentId, unitId) {
    let student = await dbStudentController.getStudent(studentId);
    let degree = await dbDegreeController.getDegree(student.degreeId);
    let unit = await dbUnitController.getUnit(unitId);

    //Create the transcript rows
    let transcriptRows = await generateTranscriptRows(studentId);

    //Generate a degree, updated transcript and microcredential certificate 
    let transcriptSuccess = await generateAttachment(studentId, student.degreeId, unitId, transcriptRows, student, degree, unit, transcriptAttachmentOption);
    let certificateSuccess = await generateAttachment(studentId, student.degreeId, unitId, transcriptRows, student, degree, unit, certificateAttachmentOption);
    let degreeSuccess = await generateAttachment(studentId, student.degreeId, unitId, transcriptRows, student, degree, unit, degreeAttachmentOption);

    let transcriptPath = `../attachments/${studentId}_Transcript.pdf`;
    let certificatePath = `../attachments/${studentId}_${unit.unitId}.pdf`;
    let degreePath = `../attachments/${studentId}_${student.degreeId}.pdf`;

    //If the attachments were created successfully, upload them to s3. Else throw an error
    if (transcriptSuccess && certificateSuccess && degreeSuccess) {
        await uploadToS3(transcriptBucket, transcriptPath);
        await uploadToS3(certificateBucket, certificatePath);
        await uploadToS3(degreeBucket, degreePath);
    }
    else {
        throw Error("Email Service Error");
    }

    let transcript = fs.readFileSync(transcriptPath).toString("base64");
    let degreePdf = fs.readFileSync(degreePath).toString("base64");
    let certificate = fs.readFileSync(certificatePath).toString("base64");

    //Add the generated pdfs to a list of attachments 
    let attachments = [
        {
            content: transcript,
            filename: `${studentId}_Transcript.pdf`,
            type: "application/pdf",
            disposition: "attachment"
        },
        {
            content: certificate,
            filename: `${studentId}_${unit.unitId}_Certificate.pdf`,
            type: "application/pdf",
            disposition: "attachment"
        },
        {
            content: degreePdf,
            filename: `${studentId}_${degree.degreeName}.pdf`,
            type: "application/pdf",
            disposition: "attachment"
        }
    ];

    //Create the email header and contents
    let subject = 'CONGRATULATIONS - Your Degree is Complete';
    let text = `Dear ${student.studentName}, on behalf of the entire RMIT team, we congratulate you on completing the ${degree.degreeName}. Please find attached the following: Your Degree Transcript 
    Your Micro-Credential Certificate for: ${unitId} - ${unit.unitName} Last but not the least, your ${degree.degreeName} Degree 
    We hope you had a wonderful time at the Royal Melbourne Institute of Technology, and we would like to wish you luck for your future endeavours. Sincerely, The RMIT Team.`;

    let html = `Dear <strong>${student.studentName}</strong>, <br><br> on behalf of the entire RMIT team, we congratulate you on completing the <strong>${degree.degreeName}</strong>. 
    <br><br>Please find attached the following: <ul><li><strong>Your Degree Transcript</strong></li><li><strong>Your Micro-Credential Certificate for: ${unitId} - ${unit.unitName}</strong></li>
    <li>Last but not the least, <strong>your ${degree.degreeName} Degree</strong></li></ul> We hope you had a wonderful time at the Royal Melbourne Institute of Technology, and
    we would like to wish you luck for your future endeavours. <br><br><strong>Sincerely, <br>The RMIT Team.</strong>`;

    //Send the email 
    await sendEmail(student.studentEmail, subject, text, attachments, html);

    //Delete the files from local storage
    await deleteFiles([transcriptPath, certificatePath, degreePath]);
}

//Function called to send an email when a year of a degree is complete
async function sendYearEmail(studentId, unitId) {
    let student = await dbStudentController.getStudent(studentId);
    let degree = await dbDegreeController.getDegree(student.degreeId);
    let unit = await dbUnitController.getUnit(unitId);
    let year = (student.studentCreditPoints / degree.creditPointsPerSem) / 2;

    //Create the transcript rows
    let transcriptRows = await generateTranscriptRows(studentId);

    //Generate an updated transcript and microcredential certificate 
    let transcriptSuccess = await generateAttachment(studentId, student.degreeId, unitId, transcriptRows, student, degree, unit, transcriptAttachmentOption);
    let certificateSuccess = await generateAttachment(studentId, student.degreeId, unitId, transcriptRows, student, degree, unit, certificateAttachmentOption);

    let transcriptPath = `../attachments/${studentId}_Transcript.pdf`;
    let certificatePath = `../attachments/${studentId}_${unit.unitId}.pdf`;

    //If the attachments were created successfully, upload them to s3. Else throw an error
    if (transcriptSuccess && certificateSuccess) {
        await uploadToS3(transcriptBucket, transcriptPath);
        await uploadToS3(certificateBucket, certificatePath);
    }
    else {
        throw Error("Email Service Error");
    }

    let transcript = fs.readFileSync(transcriptPath).toString("base64");
    let certificate = fs.readFileSync(certificatePath).toString("base64");

    //Add the generated pdfs to a list of attachments
    let attachments = [
        {
            content: transcript,
            filename: `${studentId}_Transcript.pdf`,
            type: "application/pdf",
            disposition: "attachment"
        },
        {
            content: certificate,
            filename: `${studentId}_${unit.unitId}_Certificate.pdf`,
            type: "application/pdf",
            disposition: "attachment"
        }
    ];

    //Create the email header and contents
    let subject = `CONGRATULATIONS - Year ${year} is Complete`;
    let text = `Dear ${student.studentName}, on behalf of the entire RMIT team, congratulations on completing Year ${year} of the ${degree.degreeName}. Please find attached the following: Your Updated Transcript 
    Your Micro-Credential Certificate for: ${unitId} - ${unit.unitName}
    Sincerely, The RMIT Team.`;

    let html = `Dear <strong>${student.studentName}</strong>, <br><br> on behalf of the entire RMIT team, congratulations on completing Year ${year} of the <strong>${degree.degreeName}</strong>. 
    <br><br>Please find attached the following: <ul><li><strong>Your Updated Transcript</strong></li><li><strong>Your Micro-Credential Certificate for: ${unitId} - ${unit.unitName}</strong></li></ul> 
    <br><strong>Sincerely, <br>The RMIT Team.</strong>`;

    //Send the email
    await sendEmail(student.studentEmail, subject, text, attachments, html);

    //Delete the files from local storage
    await deleteFiles([transcriptPath, certificatePath]);
}

//Function called to send an email when a semester of a degree is complete
async function sendSemesterEmail(studentId, unitId) {
    let student = await dbStudentController.getStudent(studentId);
    let degree = await dbDegreeController.getDegree(student.degreeId);
    let unit = await dbUnitController.getUnit(unitId);
    let year = ((student.studentCreditPoints - degree.creditPointsPerSem) / degree.creditPointsPerSem) / 2;

    //Create the transcript rows
    let transcriptRows = await generateTranscriptRows(studentId);

    //Generate an updated transcript and microcredential certificate 
    let transcriptSuccess = await generateAttachment(studentId, student.degreeId, unitId, transcriptRows, student, degree, unit, transcriptAttachmentOption);
    let certificateSuccess = await generateAttachment(studentId, student.degreeId, unitId, transcriptRows, student, degree, unit, certificateAttachmentOption);

    let transcriptPath = `../attachments/${studentId}_Transcript.pdf`;
    let certificatePath = `../attachments/${studentId}_${unit.unitId}.pdf`;

    //If the attachments were created successfully, upload them to s3. Else throw an error
    if (transcriptSuccess && certificateSuccess) {
        await uploadToS3(transcriptBucket, transcriptPath);
        await uploadToS3(certificateBucket, certificatePath);
    }
    else {
        throw Error("Email Service Error");
    }

    let transcript = fs.readFileSync(transcriptPath).toString("base64");
    let certificate = fs.readFileSync(certificatePath).toString("base64");

    //Add the generated pdfs to a list of attachments
    let attachments = [
        {
            content: transcript,
            filename: `${studentId}_Transcript.pdf`,
            type: "application/pdf",
            disposition: "attachment"
        },
        {
            content: certificate,
            filename: `${studentId}_${unit.unitId}_Certificate.pdf`,
            type: "application/pdf",
            disposition: "attachment"
        }
    ];

    //Create the email header and contents
    let subject = `CONGRATULATIONS - Semeseter 1 of ${year} is Complete`;
    let text = `Dear ${student.studentName}, on behalf of the entire RMIT team, congratulations on completing Semeseter 1 of Year ${year} of the ${degree.degreeName}. Please find attached the following: Your Updated Transcript 
    Your Micro-Credential Certificate for: ${unitId} - ${unit.unitName} 
    Sincerely, The RMIT Team.`;

    let html = `Dear <strong>${student.studentName}</strong>, <br><br> on behalf of the entire RMIT team, congratulations on completing Semeseter 1 of Year ${year} of the <strong>${degree.degreeName}</strong>. 
    <br><br>Please find attached the following: <ul><li><strong>Your Updated Transcript</strong></li><li><strong>Your Micro-Credential Certificate for: ${unitId} - ${unit.unitName}</strong></li></ul> 
    <br><strong>Sincerely, <br>The RMIT Team.</strong>`;

    //Send the email
    await sendEmail(student.studentEmail, subject, text, attachments, html);

    //Delete the files from local storage
    await deleteFiles([transcriptPath, certificatePath]);
}

//Function called to send an email when a unit is complete
async function sendUnitEmail(studentId, unitId) {
    let student = await dbStudentController.getStudent(studentId);
    let degree = await dbDegreeController.getDegree(student.degreeId);
    let unit = await dbUnitController.getUnit(unitId);

    //Create the transcript rows
    let transcriptRows = await generateTranscriptRows(studentId);

    //Generate an updated transcript and microcredential certificate 
    let transcriptSuccess = await generateAttachment(studentId, student.degreeId, unitId, transcriptRows, student, degree, unit, transcriptAttachmentOption);
    let certificateSuccess = await generateAttachment(studentId, student.degreeId, unitId, transcriptRows, student, degree, unit, certificateAttachmentOption);

    let transcriptPath = `../attachments/${studentId}_Transcript.pdf`;
    let certificatePath = `../attachments/${studentId}_${unit.unitId}.pdf`;

    //If the attachments were created successfully, upload them to s3. Else throw an error
    if (transcriptSuccess && certificateSuccess) {
        await uploadToS3(transcriptBucket, transcriptPath);
        await uploadToS3(certificateBucket, certificatePath);
    }
    else {
        throw Error("Email Service Error");
    }

    let transcript = fs.readFileSync(transcriptPath).toString("base64");
    let certificate = fs.readFileSync(certificatePath).toString("base64");

    //Add the generated pdfs to a list of attachments
    let attachments = [
        {
            content: transcript,
            filename: `${studentId}_Transcript.pdf`,
            type: "application/pdf",
            disposition: "attachment"
        },
        {
            content: certificate,
            filename: `${studentId}_${unit.unitId}_Certificate.pdf`,
            type: "application/pdf",
            disposition: "attachment"
        }
    ];

    //Create the email header and contents
    let subject = 'CONGRATULATIONS - Your Micro-Credential is Complete';
    let text = `Dear ${student.studentName}, on behalf of the entire RMIT team, we congratulate you on completing ${unitId} - ${unit.unitName}. Please find attached the following: Your Updated Transcript 
    Your Micro-Credential Certificate for: ${unitId} - ${unit.unitName}
    Sincerely, The RMIT Team.`;

    let html = `Dear <strong>${student.studentName}</strong>, <br><br> on behalf of the entire RMIT team, we congratulate you on completing <strong>${unitId} - ${unit.unitName}</strong>. 
    <br><br>Please find attached the following: <ul><li><strong>Your Updated Transcript</strong></li><li><strong>Your Micro-Credential Certificate for: ${unitId} - ${unit.unitName}</strong></li></ul> 
    <br><strong>Sincerely, <br>The RMIT Team.</strong>`;

    //Send the email
    await sendEmail(student.studentEmail, subject, text, attachments, html);

    //Delete the files from local storage
    await deleteFiles([transcriptPath, certificatePath]);
}

//Function called to send an email when a unit is complete
async function sendFailEmail(studentId, unitId) {
    let student = await dbStudentController.getStudent(studentId);
    let degree = await dbDegreeController.getDegree(student.degreeId);
    let unit = await dbUnitController.getUnit(unitId);

    //Create the transcript rows
    let transcriptRows = await generateTranscriptRows(studentId);

    //Generate an updated transcript
    let transcriptSuccess = await generateAttachment(studentId, student.degreeId, unitId, transcriptRows, student, degree, unit, transcriptAttachmentOption);

    let transcriptPath = `../attachments/${studentId}_Transcript.pdf`;

    //If the attachment was created successfully, upload it to s3. Else throw an error
    if (transcriptSuccess) {
        await uploadToS3(transcriptBucket, transcriptPath);
    }
    else {
        throw Error("Email Service Error");
    }

    let transcript = fs.readFileSync(transcriptPath).toString("base64");

    //Add the generated pdf to a list of attachments
    let attachments = [
        {
            content: transcript,
            filename: `${studentId}_Transcript.pdf`,
            type: "application/pdf",
            disposition: "attachment"
        }
    ];

    //Create the email header and contents
    let subject = 'Micro-Credential Unsuccessful';
    let text = `Dear ${student.studentName}, we regret to inform you that you have not completed ${unitId} - ${unit.unitName}. Please find attached the following: Your Updated Transcript 
    Sincerely, The RMIT Team.`;

    let html = `Dear <strong>${student.studentName}</strong>, <br><br> we regret to inform you that you have not completed <strong>${unitId} - ${unit.unitName}</strong>. 
    <br><br>Please find attached the following: <ul><li><strong>Your Updated Transcript</strong></li></ul>
    <br><strong>Sincerely, <br>The RMIT Team.</strong>`;

    //Send the email
    await sendEmail(student.studentEmail, subject, text, attachments, html);

    //Delete the files from local storage
    await deleteFiles([transcriptPath]);
}

//Function to delete all the files given their paths
async function deleteFiles(filePaths) {
    for (const path of filePaths) {
        fs.unlinkSync(path);
    }
}

module.exports = {
    sendDegreeEmail,
    sendYearEmail,
    sendSemesterEmail,
    sendUnitEmail,
    sendFailEmail
};