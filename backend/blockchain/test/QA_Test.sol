// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/QA.sol";

contract QA_Test 
{
    // The address of the Module contract to be tested
    QA qa_contract = QA(DeployedAddresses.QA());

    // The expected length of the array 
    uint expectedLength = 1;

    uint expectedFirstIndex = 0;

    string expectedString = "This is a sample string";

    function testAddHash() public 
    {
        qa_contract.addHash(expectedString);

        uint returnedIndex = qa_contract.getLastIndex();

        Assert.equal(returnedIndex, expectedFirstIndex, "Expected Index should match the index that is returned.");
    }

    function  testLength() public
    {
        uint returnedLength = qa_contract.getLength();

        Assert.equal(returnedLength, expectedLength, "Expected length should match the length that is returned.");
    }

    function testReturnFirstHash() public
    {
        string memory returnedHash = qa_contract.returnHash(expectedFirstIndex);
        
        Assert.equal(returnedHash, expectedString, "Expected string should match the string that is returned.");
    }
}


