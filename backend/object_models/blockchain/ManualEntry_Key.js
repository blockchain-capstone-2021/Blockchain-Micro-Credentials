//Manual Entry Key Object - Unique key to track a manual entry hash index
class ManualEntry_Key {
    constructor(studentId, unitId, semEnrol) {
        this._studentId = studentId;
        this._unitId = unitId;
        this._semEnrol = semEnrol;
    }
}

module.exports = ManualEntry_Key;