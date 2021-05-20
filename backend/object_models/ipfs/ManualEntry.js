//Manual Entry Data Object - Used for serialization and IPFS Upload
class ManualEntry {
    constructor(studentId, unitId, semEnrol, finalResult) {
        this._studentId = studentId;
        this._unitId = unitId;
        this._semEnrol = semEnrol;
        this._finalResult = finalResult;
    }
}

module.exports = ManualEntry;