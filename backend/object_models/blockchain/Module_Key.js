//Micro Module Key Object - Unique key to track a micro module hash index
class Module_Key {
    constructor(studentId, unitId, moduleId, semEnrol, attemptNo) {
        this._studentId = studentId;
        this._unitId = unitId;
        this._moduleId = moduleId;
        this._semEnrol = semEnrol;
        this._attemptNo = attemptNo;
    }
}

module.exports = Module_Key;