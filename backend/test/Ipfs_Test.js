const assert = require('assert');

const ipfs = require('../middleware/ipfs')

describe('ipfs', () => {
    describe('storeData()', () => {
        it('should return a hash', async () => {
            let expectedHash = 'QmaBD9ZiHoxcjLuBNPn1NXoCn8SFHu7fA1S9e3pdrdbxL2'
            let testString = 'Test Data'
            let actualHash = await ipfs.ipfsStoreData(testString)
            assert.strictEqual(actualHash, expectedHash);
        }).timeout(10000);
    })
    describe('getData()', () => {
        it('should return a string', async () => {
            let expectedString = 'Test Data'
            let hash = 'QmaBD9ZiHoxcjLuBNPn1NXoCn8SFHu7fA1S9e3pdrdbxL2'
            let actualString = await ipfs.ipfsGetData(hash)
            assert.strictEqual(actualString, expectedString);
        }).timeout(10000);
        it('should not return an incorrect string', async () => {
            let expectedString = ''
            let hash = 'QmaBD9ZiHoxcjLuBNPn1NXoCn8SFHu7fA1S9e3pdrdbxL2'
            let actualString = await ipfs.ipfsGetData(hash)
            assert.notStrictEqual(actualString, expectedString);
        }).timeout(10000);
    })
});