const assert = require('assert');

const dbStaffController = require('../db/controllers/DbStaffController')

describe('Db Staff Controller', () => {
    describe('getStaff()', () => {
        it('should return the correct staff Id', async () => {
            let staffId = 'e1234567'
            let staff = await dbStaffController.getStaff(staffId)
            assert.strictEqual(staff.staffId, staffId);
        }).timeout(10000);
        it('should return the incorrect staff Id', async () => {
            let staffId = 'e1234567'
            let expectedStaffId = "e2345678"
            let staff = await dbStaffController.getStaff(staffId)
            assert.notStrictEqual(staff.staffId, expectedStaffId);
        }).timeout(10000);
    })
    describe('checkStaffExists()', () => {
        it('should return the staff exists', async () => {
            let staffId = 'e1234567'
            let expectedExists = true
            let exists = await dbStaffController.checkStaffExists(staffId)
            assert.strictEqual(exists, expectedExists);
        }).timeout(10000);
        it('should return the staff does not exist', async () => {
            let staffId = 'eTest'
            let expectedExists = false
            let exists = await dbStaffController.checkStaffExists(staffId)
            assert.strictEqual(exists, expectedExists);
        }).timeout(10000);
    })
});