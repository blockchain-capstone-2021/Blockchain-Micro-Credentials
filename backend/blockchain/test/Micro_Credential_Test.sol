// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Micro_Credential.sol";
import "../contracts/Micro_Credential_Tracker.sol";

contract Micro_Credential_Test 
{
    // The address of the Module contract to be tested
    Micro_Credential micro_cred = Micro_Credential(DeployedAddresses.Micro_Credential());

    Micro_Credential_Tracker micro_cred_tracker = Micro_Credential_Tracker(DeployedAddresses.Micro_Credential_Tracker());

    // The expected length of the array 
    uint expectedSecondLength = 2;

    uint expectedFirstLength = 1;

    uint expectedSecondIndex = 1;

    uint expectedFirstIndex = 0;

    string expectedSecondKey = "This is the expected key";

    string expectedFirstKey = "This is a test key";

    string expectedSecondString = "This is a test string";

    string expectedFirstString = "This is a sample string";

    function testAddHash() public 
    {
        micro_cred.addHash(expectedFirstString);

        uint returnedIndex = micro_cred.getLastIndex();

        micro_cred_tracker.addTracker(expectedFirstKey, returnedIndex);

        uint size = micro_cred_tracker.getLength();

        Assert.equal(size, expectedFirstLength, "Expected size should match the size that is returned.");

        Assert.equal(returnedIndex, expectedFirstIndex, "Expected Index should match the index that is returned.");
    }

    function testAddSecondHash() public
    {
        micro_cred.addHash(expectedSecondString);

        uint returnedIndex = micro_cred.getLastIndex();

        micro_cred_tracker.addTracker(expectedSecondKey, returnedIndex);

        uint size = micro_cred_tracker.getLength();

        Assert.equal(size, expectedSecondLength, "Expected size should match the size that is returned.");

        Assert.equal(returnedIndex, expectedSecondIndex, "Expected Index should match the index that is returned.");
    }

    function  testLength() public
    {
        uint returnedLength = micro_cred.getLength();

        Assert.equal(returnedLength, expectedSecondLength, "Expected length should match the length that is returned.");
    }

    function testReturnFirstHash() public
    {
        uint returnedIndex = micro_cred_tracker.returnIndex(expectedFirstKey);

        string memory returnedHash = micro_cred.returnHash(returnedIndex);
        
        Assert.equal(returnedHash, expectedFirstString, "Expected string should match the string that is returned.");
    }

    function testReturnSecondHash() public
    {
        uint returnedIndex = micro_cred_tracker.returnIndex(expectedSecondKey);

        string memory returnedHash = micro_cred.returnHash(returnedIndex);
        
        Assert.equal(returnedHash, expectedSecondString, "Expected string should match the string that is returned.");
    }

    function testExists() public
    {
        bool exists = micro_cred_tracker.checkExists(expectedFirstKey);

        Assert.equal(exists, true, "Expected state of existence should match the state of existence that is returned.");
    }

    function testNotExist() public
    {
        bool exists = micro_cred_tracker.checkExists("does not exist");

        Assert.equal(exists, false, "Expected state of existence should match the state of existence that is returned.");
    }

    function testUpdateValue() public
    {
        micro_cred_tracker.addTracker(expectedSecondKey, expectedFirstIndex);

        uint returnedIndex = micro_cred_tracker.returnIndex(expectedSecondKey);

        Assert.equal(returnedIndex, expectedFirstIndex, "Expected index should match the index that is returned.");

        string memory returnedHash = micro_cred.returnHash(returnedIndex);
        
        Assert.equal(returnedHash, expectedFirstString, "Expected string should match the string that is returned.");
    }
}


