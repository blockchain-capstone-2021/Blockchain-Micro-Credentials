// SPDX-License-Identifier: MIT
pragma solidity >=0.6.8 <=0.8.3;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Manual_Entry.sol";
import "../contracts/Manual_Entry_Tracker.sol";

contract Manual_Entry_Test {
    Manual_Entry man_entry = Manual_Entry(DeployedAddresses.Manual_Entry());

    Manual_Entry_Tracker man_entry_tracker = Manual_Entry_Tracker(DeployedAddresses.Manual_Entry_Tracker());

    uint256 expectedSecondLength = 2;

    uint256 expectedFirstLength = 1;

    uint256 expectedSecondIndex = 1;

    uint256 expectedFirstIndex = 0;

    string expectedSecondKey = "This is the expected key";

    string expectedFirstKey = "This is a test key";

    string expectedSecondString = "This is a test string";

    string expectedFirstString = "This is a sample string";

    //Test whether a hash is being added correctly:
    //  -- The size of the tracker should be correct 
    //  -- The index being added to the tracker should be correct
    function testAddHash() public {
        man_entry.addHash(expectedFirstString);

        uint256 returnedIndex = man_entry.getLastIndex();

        man_entry_tracker.addTracker(expectedFirstKey, returnedIndex);

        uint256 size = man_entry_tracker.getLength();

        Assert.equal(size, expectedFirstLength, "Expected size should match the size that is returned.");

        Assert.equal(returnedIndex, expectedFirstIndex, "Expected Index should match the index that is returned.");
    }
    
    //Test whether a second hash is being added correctly:
    //  -- The size of the tracker should be correct 
    //  -- The index being added to the tracker should be correct
    function testAddSecondHash() public {
        man_entry.addHash(expectedSecondString);

        uint256 returnedIndex = man_entry.getLastIndex();

        man_entry_tracker.addTracker(expectedSecondKey, returnedIndex);

        uint256 size = man_entry_tracker.getLength();

        Assert.equal(size, expectedSecondLength, "Expected size should match the size that is returned.");

        Assert.equal(returnedIndex, expectedSecondIndex, "Expected Index should match the index that is returned.");
    }

    //Test whether the length of the hash array is correct
    function testLength() public {
        uint256 returnedLength = man_entry.getLength();

        Assert.equal(returnedLength, expectedSecondLength, "Expected length should match the length that is returned.");
    }

    //Test whether the first hash being returned is correct
    function testReturnFirstHash() public {
        uint256 returnedIndex = man_entry_tracker.returnIndex(expectedFirstKey);

        string memory returnedHash = man_entry.returnHash(returnedIndex);

        Assert.equal(returnedHash, expectedFirstString, "Expected string should match the string that is returned.");
    }

    //Test whether the second hash being returned is correct
    function testReturnSecondHash() public {
        uint256 returnedIndex =
            man_entry_tracker.returnIndex(expectedSecondKey);

        string memory returnedHash = man_entry.returnHash(returnedIndex);

        Assert.equal(returnedHash, expectedSecondString, "Expected string should match the string that is returned.");
    }

    //Test whether the a particular key exists
    function testExists() public {
        bool exists = man_entry_tracker.checkExists(expectedFirstKey);

        Assert.equal(exists, true, "Expected state of existence should match the state of existence that is returned.");
    }

    //Test whether a particular key does not exist
    function testNotExist() public {
        bool exists = man_entry_tracker.checkExists("does not exist");

        Assert.equal(exists, false, "Expected state of existence should match the state of existence that is returned.");
    }

    //Test whether the tracked index for a key is changeable, and whether the returned hash is then correct.
    function testUpdateValue() public {
        man_entry_tracker.addTracker(expectedSecondKey, expectedFirstIndex);

        uint256 returnedIndex = man_entry_tracker.returnIndex(expectedSecondKey);

        Assert.equal(returnedIndex, expectedFirstIndex, "Expected index should match the index that is returned.");

        string memory returnedHash = man_entry.returnHash(returnedIndex);

        Assert.equal(returnedHash, expectedFirstString, "Expected string should match the string that is returned.");
    }
}
