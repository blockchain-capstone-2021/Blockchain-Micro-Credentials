class Unit{
    constructor (microCredentialIndex, manualEntryIndex, studentId, unitId, semEnrol, finalResult){
        this._microCredentialIndex = microCredentialIndex //should be null if manualEntryIndex is not null
        this._manualEntryIndex = manualEntryIndex //shoudl be null if microCredentialIndex is not null
        this._studentId = studentId
        this._unitId = unitId
        this._semEnrol = semEnrol
        this._finalResult = finalResult
    }
}

module.exports = Unit