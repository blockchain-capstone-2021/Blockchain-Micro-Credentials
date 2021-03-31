class MicroModule{
    constructor (qAList, studentId, unitId, moduleId, semEnrol, attemptNo, result){
        this._qAList = qAList
        this._studentId = studentId
        this._unitId = unitId
        this._moduleId = moduleId
        this._semEnrol = semEnrol
        this._attemptNo = attemptNo
        this._result = result
    }
}

module.exports = MicroModule