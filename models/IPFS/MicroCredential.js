class MicroCredential{
    constructor (moduleList, studentId, unitId, semEnrol, resultCumulative){
        this._moduleList = moduleList
        this._studentId = studentId
        this._unitId = unitId
        this._semEnrol = semEnrol
        this._resultCumulative = resultCumulative
    }
}

module.exports = MicroCredential