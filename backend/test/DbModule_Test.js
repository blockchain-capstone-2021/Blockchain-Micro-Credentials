const assert = require('assert');

const dbModuleController = require('../db/controllers/DbModuleController')
const dbUnitController  =  require('../db/controllers/DbUnitController')

describe('Db Module Controller', () => {
    describe('getModule()', () => {
        it('should return the correct moduke Id', async () => {
            let moduleId = 1
            let module = await dbModuleController.getModule(moduleId)
            assert.strictEqual(module.moduleId, moduleId);
        }).timeout(10000);
        it('should return the incorrect module Id', async () => {
            let moduleId = 1
            let expectedModuleId = 2
            let module = await dbModuleController.getModule(moduleId)
            assert.notStrictEqual(module.moduleId, expectedModuleId);
        }).timeout(10000);
    })
    describe('getModulesByUnit()', () => {
        it('should return all the modules of a unit', async () => {
            let unitId = "COSC2536"
            let unit = await dbUnitController.getUnit(unitId)
            let modules = await dbModuleController.getModulesByUnit(unitId)
            assert.strictEqual(modules.length, unit.noOfModules);
            for(const module of modules){
                assert.strictEqual(module.unitId, unitId);
            }
        }).timeout(10000);
    })
}); 