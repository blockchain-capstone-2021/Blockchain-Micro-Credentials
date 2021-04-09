class Student_Data{
    constructor (studentId, name, totalCreditPoints, creditsPerSemester, degreeId, passwordHash){
        this._studentId = studentId
        this._name = name
        this._totalCreditPoints = totalCreditPoints
        this._creditsPerSemester = creditsPerSemester
        this._degreeId = degreeId
        this._passwordHash = passwordHash
    }
}

module.exports = Student_Data