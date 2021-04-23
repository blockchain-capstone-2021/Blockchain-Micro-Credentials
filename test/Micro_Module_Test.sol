// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Micro_Module.sol";
import "../contracts/Micro_Module_Tracker.sol";

contract Micro_Module_Test 
{
    // The address of the Module contract to be tested
    Micro_Module mod = Micro_Module(DeployedAddresses.Micro_Module());

    Micro_Module_Tracker mod_tracker = Micro_Module_Tracker(DeployedAddresses.Micro_Module_Tracker());

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
        mod.addHash(expectedFirstString);

        uint returnedIndex = mod.getLastIndex();

        mod_tracker.addTracker(expectedFirstKey, returnedIndex);

        uint size = mod_tracker.getLength();

        Assert.equal(size, expectedFirstLength, "Expected size should match the size that is returned.");

        Assert.equal(returnedIndex, expectedFirstIndex, "Expected Index should match the index that is returned.");
    }

    function testAddSecondHash() public
    {
        mod.addHash(expectedSecondString);

        uint returnedIndex = mod.getLastIndex();

        mod_tracker.addTracker(expectedSecondKey, returnedIndex);

        uint size = mod_tracker.getLength();

        Assert.equal(size, expectedSecondLength, "Expected size should match the size that is returned.");

        Assert.equal(returnedIndex, expectedSecondIndex, "Expected Index should match the index that is returned.");
    }

    function  testLength() public
    {
        uint returnedLength = mod.getLength();

        Assert.equal(returnedLength, expectedSecondLength, "Expected length should match the length that is returned.");
    }

    function testReturnFirstHash() public
    {
        uint returnedIndex = mod_tracker.returnIndex(expectedFirstKey);

        string memory returnedHash = mod.returnHash(returnedIndex);
        
        Assert.equal(returnedHash, expectedFirstString, "Expected string should match the string that is returned.");
    }

    function testReturnSecondHash() public
    {
        uint returnedIndex = mod_tracker.returnIndex(expectedSecondKey);

        string memory returnedHash = mod.returnHash(returnedIndex);
        
        Assert.equal(returnedHash, expectedSecondString, "Expected string should match the string that is returned.");
    }

    function testExists() public
    {
        bool exists = mod_tracker.checkExists(expectedFirstKey);

        Assert.equal(exists, true, "Expected state of existence should match the state of existence that is returned.");
    }

    function testNotExist() public
    {
        bool exists = mod_tracker.checkExists("does not exist");

        Assert.equal(exists, false, "Expected state of existence should match the state of existence that is returned.");
    }

    function testUpdateValue() public
    {
        mod_tracker.addTracker(expectedSecondKey, expectedFirstIndex);

        uint returnedIndex = mod_tracker.returnIndex(expectedSecondKey);

        Assert.equal(returnedIndex, expectedFirstIndex, "Expected index should match the index that is returned.");

        string memory returnedHash = mod.returnHash(returnedIndex);
        
        Assert.equal(returnedHash, expectedFirstString, "Expected string should match the string that is returned.");
    }
}


