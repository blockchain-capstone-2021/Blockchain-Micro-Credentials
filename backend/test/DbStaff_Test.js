const assert = require('assert');

const dbStaffController = require('../db/controllers/DbStaffController');

describe('Db Staff Controller', () => {
    describe('getStaff()', () => {
        //Test whether a given staff member is being returned. 
        it('should return the correct staff Id', async () => {
            let staffId = 'e1234567';
            let staff = await dbStaffController.getStaff(staffId);
            assert.strictEqual(staff.staffId, staffId);
        }).timeout(10000);
        //Test whether an incorrect staff member is not being returned.
        it('should return the incorrect staff Id', async () => {
            let staffId = 'e1234567';
            let expectedStaffId = "e2345678";
            let staff = await dbStaffController.getStaff(staffId);
            assert.notStrictEqual(staff.staffId, expectedStaffId);
        }).timeout(10000);
    });
    describe('checkStaffExists()', () => {
        //Test whether a staff member exists given a staffId.
        it('should return the staff exists', async () => {
            let staffId = 'e1234567';
            let expectedExists = true;
            let exists = await dbStaffController.checkStaffExists(staffId);
            assert.strictEqual(exists, expectedExists);
        }).timeout(10000);
        //Test to verify that a staff member does not exist when an unregistered staffId is search for.
        it('should return the staff does not exist', async () => {
            let staffId = 'eTest';
            let expectedExists = false;
            let exists = await dbStaffController.checkStaffExists(staffId);
            assert.strictEqual(exists, expectedExists);
        }).timeout(10000);
    });
});