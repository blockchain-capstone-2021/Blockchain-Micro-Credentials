//Micro Module Key Object - Unique key to track a micro module hash index
class ModuleBest_Key {
    constructor(studentId, unitId, moduleId, semEnrol) {
        this._studentId = studentId;
        this._unitId = unitId;
        this._moduleId = moduleId;
        this._semEnrol = semEnrol;
    }
}

module.exports = ModuleBest_Key;