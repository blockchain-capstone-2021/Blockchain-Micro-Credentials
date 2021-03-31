class QA{
    constructor (question, providedAnswer, correctAnswer, studentId, unitId, moduleId, semEnrol, attemptNo){
        this._question = question
        this._providedAnswer = providedAnswer
        this._correctAnswer = correctAnswer
        this._studentId = studentId
        this._unitId = unitId
        this._moduleId = moduleId
        this._semEnrol = semEnrol
        this._attemptNo = attemptNo
    }
}

module.exports = QA