const assert = require('assert');
var DbDegreeController = require('../db/controllers/DbDegreeController');

describe('Degree', () => {
    //Test to check whether the correct degree is being returned.
    describe('getDegree()', () => {
        it('should return the degree with the correct Id', async () => {
            let expectedDegreeId = "BP094";
            let actualDegree = await DbDegreeController.getDegree(expectedDegreeId);
            let actualDegreeId = actualDegree.degreeId;
            assert.strictEqual(actualDegreeId, expectedDegreeId);
        }).timeout(10000);
    });

});