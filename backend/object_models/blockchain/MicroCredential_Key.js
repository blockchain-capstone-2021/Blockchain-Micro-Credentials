//Microcredential key object - Unique key to track a microcredential hash index
class MicroCredential_Key {
    constructor(studentId, unitId, semEnrol) {
        this._studentId = studentId;
        this._unitId = unitId;
        this._semEnrol = semEnrol;
    }
}

module.exports = MicroCredential_Key;