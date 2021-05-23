//Unit Data Object - Used for serialization and IPFS Upload
class Unit {
    constructor(microCredentialIndex, manualEntryIndex, studentId, unitId, semEnrol, finalResult) {
        this._microCredentialIndex = microCredentialIndex; //should be undefined if manualEntryIndex is not null
        this._manualEntryIndex = manualEntryIndex; //should be undefined if microCredentialIndex is not null
        this._studentId = studentId;
        this._unitId = unitId;
        this._semEnrol = semEnrol;
        this._finalResult = finalResult;
    }
}

module.exports = Unit;