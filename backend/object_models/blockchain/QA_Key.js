//QA Key Object - Unique key to track a QA pair hash index
class QA_Key {
    constructor(studentId, unitId, moduleId, questionId, attemptNo, semEnrol) {
        this._studentId = studentId;
        this._unitId = unitId;
        this._moduleId = moduleId;
        this._questionId = questionId;
        this._attemptNo = attemptNo;
        this._semEnrol = semEnrol;
    }
}

module.exports = QA_Key;