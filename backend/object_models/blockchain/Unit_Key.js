//Unit Key Object - Unique key to track an unit hash index
class Unit_Key {
    constructor(studentId, unitId, semEnrol) {
        this._studentId = studentId;
        this._unitId = unitId;
        this._semEnrol = semEnrol;
    }
}

module.exports = Unit_Key;