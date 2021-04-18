// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Manual_Entry.sol";
import "../contracts/Manual_Entry_Tracker.sol";

contract Manual_Entry_Test
{
    // The address of the Module contract to be tested
    Manual_Entry man_entry = Manual_Entry(DeployedAddresses.Manual_Entry());

    Manual_Entry_Tracker man_entry_tracker = Manual_Entry_Tracker(DeployedAddresses.Manual_Entry_Tracker());

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
        man_entry.addHash(expectedFirstString);

        uint returnedIndex = man_entry.getLastIndex();

        man_entry_tracker.addTracker(expectedFirstKey, returnedIndex);

        uint size = man_entry_tracker.getLength();

        Assert.equal(size, expectedFirstLength, "Expected size should match the size that is returned.");

        Assert.equal(returnedIndex, expectedFirstIndex, "Expected Index should match the index that is returned.");
    }

    function testAddSecondHash() public
    {
        man_entry.addHash(expectedSecondString);

        uint returnedIndex = man_entry.getLastIndex();

        man_entry_tracker.addTracker(expectedSecondKey, returnedIndex);

        uint size = man_entry_tracker.getLength();

        Assert.equal(size, expectedSecondLength, "Expected size should match the size that is returned.");

        Assert.equal(returnedIndex, expectedSecondIndex, "Expected Index should match the index that is returned.");
    }

    function  testLength() public
    {
        uint returnedLength = man_entry.getLength();

        Assert.equal(returnedLength, expectedSecondLength, "Expected length should match the length that is returned.");
    }

    function testReturnFirstHash() public
    {
        uint returnedIndex = man_entry_tracker.returnIndex(expectedFirstKey);

        string memory returnedHash = man_entry.returnHash(returnedIndex);
        
        Assert.equal(returnedHash, expectedFirstString, "Expected string should match the string that is returned.");
    }

    function testReturnSecondHash() public
    {
        uint returnedIndex = man_entry_tracker.returnIndex(expectedSecondKey);

        string memory returnedHash = man_entry.returnHash(returnedIndex);
        
        Assert.equal(returnedHash, expectedSecondString, "Expected string should match the string that is returned.");
    }

    function testExists() public
    {
        bool exists = man_entry_tracker.checkExists(expectedFirstKey);

        Assert.equal(exists, true, "Expected state of existence should match the state of existence that is returned.");
    }

    function testNotExist() public
    {
        bool exists = man_entry_tracker.checkExists("does not exist");

        Assert.equal(exists, false, "Expected state of existence should match the state of existence that is returned.");
    }

    function testUpdateValue() public
    {
        man_entry_tracker.addTracker(expectedSecondKey, expectedFirstIndex);

        uint returnedIndex = man_entry_tracker.returnIndex(expectedSecondKey);

        Assert.equal(returnedIndex, expectedFirstIndex, "Expected index should match the index that is returned.");

        string memory returnedHash = man_entry.returnHash(returnedIndex);
        
        Assert.equal(returnedHash, expectedFirstString, "Expected string should match the string that is returned.");
    }
}


