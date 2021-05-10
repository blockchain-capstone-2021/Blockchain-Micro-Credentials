class QA{
    constructor (question, providedAnswer, correctAnswer, studentId, unitId, moduleNo, semEnrol, attemptNo){
        this._question = question
        this._providedAnswer = providedAnswer
        this._correctAnswer = correctAnswer
        this._studentId = studentId
        this._unitId = unitId
        this._moduleNo = moduleNo
        this._semEnrol = semEnrol
        this._attemptNo = attemptNo
    }
}

module.exports = QA