const assert = require('assert');

const sequelizeMock = require('sequelize-mock')
var DBConnectionMock = new sequelizeMock

var DegreeMock = DBConnectionMock.define('degrees', 

{degreeName: "Test",
totalCreditPoints: 288,
creditPointsPerSem: 48
});

describe('Degree', () => {

    describe('getDegree()', () =>{
        it('should return the degree with the correct Id', async () => {
            let expectedDegreeId = 1
            let actualDegree = await getDegree(expectedDegreeId)
            let actualDegreeId = actualDegree.id
            assert.strictEqual(actualDegreeId, expectedDegreeId)
        }).timeout(10000);
    })
  
})

//return a degree for a given degreeId
async function getDegree(_degreeId) 
{
    let _degree;

    await DegreeMock.findById(_degreeId).then( degree => {
        _degree = degree;
    });

    return _degree;
}