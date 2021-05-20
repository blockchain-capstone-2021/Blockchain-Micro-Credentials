//Micro Module Data Object - Used for serialization and IPFS Upload
class MicroModule {
    constructor(qAList, studentId, unitId, moduleNo, semEnrol, attemptNo, result) {
        this._qAList = qAList;
        this._studentId = studentId;
        this._unitId = unitId;
        this._moduleNo = moduleNo;
        this._semEnrol = semEnrol;
        this._attemptNo = attemptNo;
        this._result = result;
    }
}

module.exports = MicroModule;