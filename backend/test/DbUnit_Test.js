const assert = require('assert');

const dbUnitController = require('../db/controllers/DbUnitController')

describe('Db Unit Controller', () => {
    describe('getUnit()', () => {
        it('should return the correct Unit Id', async () => {
            let unitId = 'COSC2536'
            let unit = await dbUnitController.getUnit(unitId)
            assert.strictEqual(unit.unitId, unitId);
        }).timeout(10000);
        it('should return the incorrect Unit Id', async () => {
            let unitId = 'COSC2536'
            let expectedUnitId = "INTE2554"
            let unit = await dbUnitController.getUnit(unitId)
            assert.notStrictEqual(unit.unitId, expectedUnitId);
        }).timeout(10000);
    })
    describe('getUnitByStaff()', () => {
        it('should return the unit taught by a staff member', async () => {
            let unitId = 'COSC2536'
            let staffId = "e1234567"
            let units = await dbUnitController.getUnitByStaff(staffId)
            for(const unit of units)
            {
                assert.strictEqual(unit.unitId, unitId);
            }
        }).timeout(10000);
        it('should return the unit taught by another staff member', async () => {
            let expectedUnitId = 'COSC2536'
            let staffId = "e2345678"
            let units = await dbUnitController.getUnitByStaff(staffId)
            for(const unit of units)
            {
                assert.notStrictEqual(units[0].unitId, expectedUnitId);
            }
        }).timeout(10000);
    })
});