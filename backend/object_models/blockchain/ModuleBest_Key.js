//Micro Module Key Object - Unique key to track the micro module with the highest score's hash index
class ModuleBest_Key {
    constructor(studentId, unitId, moduleId, semEnrol) {
        this._studentId = studentId;
        this._unitId = unitId;
        this._moduleId = moduleId;
        this._semEnrol = semEnrol;
    }
}

module.exports = ModuleBest_Key;