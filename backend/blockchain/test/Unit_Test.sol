// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Unit.sol";
import "../contracts/Unit_Tracker.sol";

contract Unit_Test {
    Unit unit = Unit(DeployedAddresses.Unit());

    Unit_Tracker unit_tracker = Unit_Tracker(DeployedAddresses.Unit_Tracker());

    uint expectedSecondLength = 2;

    uint expectedFirstLength = 1;

    uint expectedSecondIndex = 1;

    uint expectedFirstIndex = 0;

    string expectedSecondKey = "This is the expected key";

    string expectedFirstKey = "This is a test key";

    string expectedSecondString = "This is a test string";

    string expectedFirstString = "This is a sample string";

    //Test whether a hash is being added correctly:
    //  -- The size of the tracker should be correct 
    //  -- The index being added to the tracker should be correct
    function testAddHash() public {
        unit.addHash(expectedFirstString);

        uint returnedIndex = unit.getLastIndex();

        unit_tracker.addTracker(expectedFirstKey, returnedIndex);

        uint size = unit_tracker.getLength();

        Assert.equal(size, expectedFirstLength, "Expected size should match the size that is returned.");

        Assert.equal(returnedIndex, expectedFirstIndex, "Expected Index should match the index that is returned.");
    }

    //Test whether a second hash is being added correctly:
    //  -- The size of the tracker should be correct 
    //  -- The index being added to the tracker should be correct
    function testAddSecondHash() public {
        unit.addHash(expectedSecondString);

        uint returnedIndex = unit.getLastIndex();

        unit_tracker.addTracker(expectedSecondKey, returnedIndex);

        uint size = unit_tracker.getLength();

        Assert.equal(size, expectedSecondLength, "Expected size should match the size that is returned.");

        Assert.equal(returnedIndex, expectedSecondIndex, "Expected Index should match the index that is returned.");
    }

    //Test whether the length of the hash array is correct
    function  testLength() public {
        uint returnedLength = unit.getLength();

        Assert.equal(returnedLength, expectedSecondLength, "Expected length should match the length that is returned.");
    }

    //Test whether the first hash being returned is correct
    function testReturnFirstHash() public {
        uint returnedIndex = unit_tracker.returnIndex(expectedFirstKey);

        string memory returnedHash = unit.returnHash(returnedIndex);
        
        Assert.equal(returnedHash, expectedFirstString, "Expected string should match the string that is returned.");
    }

    //Test whether the second hash being returned is correct
    function testReturnSecondHash() public {
        uint returnedIndex = unit_tracker.returnIndex(expectedSecondKey);

        string memory returnedHash = unit.returnHash(returnedIndex);
        
        Assert.equal(returnedHash, expectedSecondString, "Expected string should match the string that is returned.");
    }

    //Test whether the a particular key exists
    function testExists() public {
        bool exists = unit_tracker.checkExists(expectedFirstKey);

        Assert.equal(exists, true, "Expected state of existence should match the state of existence that is returned.");
    }

    //Test whether a particular key does not exist
    function testNotExist() public {
        bool exists = unit_tracker.checkExists("does not exist");

        Assert.equal(exists, false, "Expected state of existence should match the state of existence that is returned.");
    }

    //Test whether the tracked index for a key is changeable, and whether the returned hash is then correct.
    function testUpdateValue() public {
        unit_tracker.addTracker(expectedSecondKey, expectedFirstIndex);

        uint returnedIndex = unit_tracker.returnIndex(expectedSecondKey);

        Assert.equal(returnedIndex, expectedFirstIndex, "Expected index should match the index that is returned.");

        string memory returnedHash = unit.returnHash(returnedIndex);
        
        Assert.equal(returnedHash, expectedFirstString, "Expected string should match the string that is returned.");
    }
}


